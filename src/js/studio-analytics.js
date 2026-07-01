import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const config = window.ITK_SUPABASE_CONFIG || {};
const emailForm = document.querySelector("[data-analytics-login-form]");
const emailInput = document.querySelector("[data-analytics-email]");
const loginPanel = document.querySelector("[data-analytics-login]");
const dashboardPanel = document.querySelector("[data-analytics-dashboard]");
const messageNode = document.querySelector("[data-analytics-message]");
const signedInNode = document.querySelector("[data-analytics-signed-in]");
const signOutButton = document.querySelector("[data-analytics-sign-out]");
const rangeButtons = Array.from(document.querySelectorAll("[data-analytics-range]"));
const statNodes = {
  total: document.querySelector("[data-stat-total]"),
  pageViews: document.querySelector("[data-stat-page-views]"),
  clicks: document.querySelector("[data-stat-clicks]"),
  outbound: document.querySelector("[data-stat-outbound]")
};
const topPagesNode = document.querySelector("[data-top-pages]");
const topClicksNode = document.querySelector("[data-top-clicks]");
const recentEventsNode = document.querySelector("[data-recent-events]");

let supabase = null;
let activeDays = 7;

function setMessage(text, tone) {
  if (!messageNode) return;
  messageNode.textContent = text || "";
  messageNode.dataset.tone = tone || "";
}

function currentRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function showLogin() {
  if (loginPanel) loginPanel.hidden = false;
  if (dashboardPanel) dashboardPanel.hidden = true;
}

function showDashboard() {
  if (loginPanel) loginPanel.hidden = true;
  if (dashboardPanel) dashboardPanel.hidden = false;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function countBy(items, keyGetter) {
  return items.reduce((map, item) => {
    const key = keyGetter(item) || "(not set)";
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());
}

function renderList(node, entries, emptyText) {
  if (!node) return;
  node.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = emptyText;
    node.appendChild(empty);
    return;
  }
  entries.forEach(([label, count]) => {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = label;
    const span = document.createElement("span");
    span.textContent = formatNumber(count);
    item.append(strong, span);
    node.appendChild(item);
  });
}

function renderRecent(events) {
  if (!recentEventsNode) return;
  recentEventsNode.replaceChildren();
  if (!events.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No events in this range yet.";
    row.appendChild(cell);
    recentEventsNode.appendChild(row);
    return;
  }
  events.slice(0, 25).forEach((event) => {
    const row = document.createElement("tr");
    [formatDate(event.created_at), event.event_type, event.page_path, event.element_label || "", event.target_url || ""].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    recentEventsNode.appendChild(row);
  });
}

function renderAnalytics(events) {
  const pageViews = events.filter((event) => event.event_type === "page_view");
  const clicks = events.filter((event) => event.event_type !== "page_view");
  const outbound = events.filter((event) => event.event_type === "outbound_link");

  if (statNodes.total) statNodes.total.textContent = formatNumber(events.length);
  if (statNodes.pageViews) statNodes.pageViews.textContent = formatNumber(pageViews.length);
  if (statNodes.clicks) statNodes.clicks.textContent = formatNumber(clicks.length);
  if (statNodes.outbound) statNodes.outbound.textContent = formatNumber(outbound.length);

  const topPages = Array.from(countBy(pageViews, (event) => event.page_path).entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const topClicks = Array.from(countBy(clicks, (event) => event.element_label || event.target_url || event.event_type).entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  renderList(topPagesNode, topPages, "No page views in this range yet.");
  renderList(topClicksNode, topClicks, "No click events in this range yet.");
  renderRecent(events);
}

async function loadAnalytics() {
  if (!supabase) return;
  setMessage("Loading analytics...", "");
  const since = new Date(Date.now() - activeDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("site_events")
    .select("event_type,page_path,page_title,element_label,target_url,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    renderAnalytics([]);
    setMessage("Not authorized for analytics.", "error");
    return;
  }

  renderAnalytics(data || []);
  setMessage(`Showing the last ${activeDays} days.`, "success");
}

async function verifyAdminAccess() {
  const { data, error } = await supabase.rpc("is_analytics_admin");
  if (error || data !== true) {
    renderAnalytics([]);
    setMessage("Not authorized for analytics.", "error");
    return false;
  }
  return true;
}

async function refreshSession() {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const session = data && data.session;
  if (!session) {
    showLogin();
    setMessage("Sign in with the analytics admin email to view the dashboard.", "");
    return;
  }
  if (signedInNode) signedInNode.textContent = session.user && session.user.email ? session.user.email : "Signed in";
  showDashboard();
  const isAdmin = await verifyAdminAccess();
  if (!isAdmin) return;
  await loadAnalytics();
}

function wireEvents() {
  if (emailForm) {
    emailForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = emailInput ? emailInput.value.trim() : "";
      if (!email) {
        setMessage("Enter an email address.", "error");
        return;
      }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: currentRedirectUrl()
        }
      });
      if (error) {
        setMessage("Magic link request failed. Check the email and try again.", "error");
        return;
      }
      setMessage("Magic link sent. Check your email, then return here.", "success");
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener("click", async () => {
      await supabase.auth.signOut();
      showLogin();
      setMessage("Signed out.", "success");
    });
  }

  rangeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      activeDays = Number.parseInt(button.getAttribute("data-analytics-range"), 10) || 7;
      rangeButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      await loadAnalytics();
    });
  });

  supabase.auth.onAuthStateChange(() => {
    refreshSession();
  });
}

if (!config.url || !config.publishableKey) {
  setMessage("Analytics config is missing.", "error");
  showLogin();
} else {
  supabase = createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  });
  wireEvents();
  refreshSession();
}
