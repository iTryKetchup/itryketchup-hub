# Custom Domain Plan v0.9 - iTryKetchup Studio Hub

This plan prepares the custom domain setup for iTryKetchup Studio Hub. It is a planning document only. Do not configure GitHub Pages custom domain settings, DNS, CNAME, or HTTPS enforcement until the approved Phase 7B setup task.

## Current Status

| Field | Status |
|---|---|
| Default GitHub Pages URL | https://itryketchup.github.io/itryketchup-hub/ |
| Target custom domain | itryketchup.com |
| Recommended primary domain | www.itryketchup.com |
| Apex/root domain support | itryketchup.com |
| Repository | https://github.com/iTryKetchup/itryketchup-hub |
| Repository visibility | Public |
| GitHub Pages source | GitHub Actions |
| Published artifact path | `src\` |
| Latest Pages workflow status | Success |
| DNS provider | Unknown / user-managed |
| Custom domain | Not configured |
| DNS | Not configured |
| CNAME file | Not added |

## Domain Strategy

Use `www.itryketchup.com` as the primary domain. Configure the apex/root domain `itryketchup.com` so it resolves through GitHub Pages and redirects correctly to the primary domain after GitHub Pages validates the custom domain.

GitHub Pages should be configured in repository Settings > Pages. Because this site publishes through GitHub Actions, a committed `CNAME` file is not required for this phase.

Reference: GitHub Pages custom domain documentation at https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site and troubleshooting guidance at https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages.

## DNS Records To Add Or Verify

### www.itryketchup.com

| Field | Value |
|---|---|
| Type | CNAME |
| Name / Host | `www` |
| Value / Target | `iTryKetchup.github.io` |
| TTL | DNS provider default or 1 hour if available |

Do not include the repository name in the CNAME target. The target is `iTryKetchup.github.io`, not `iTryKetchup.github.io/itryketchup-hub`.

### itryketchup.com

| Field | Value |
|---|---|
| Type | A |
| Name / Host | `@` |
| TTL | DNS provider default or 1 hour if available |

Add or verify these A record values:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Optional IPv6 For itryketchup.com

| Field | Value |
|---|---|
| Type | AAAA |
| Name / Host | `@` |
| TTL | DNS provider default or 1 hour if available |

Optional AAAA record values:

```text
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

## DNS Records To Avoid Or Remove

- Wildcard records such as `*.itryketchup.com`.
- Extra A, AAAA, ALIAS, or ANAME records for `@` that do not point to GitHub Pages.
- Extra CNAME records for `www` that do not point to `iTryKetchup.github.io`.
- Forwarding, parking, or registrar default records that conflict with GitHub Pages.
- Any CNAME value that includes the repository path, such as `iTryKetchup.github.io/itryketchup-hub`.

## Order Of Operations

1. In GitHub repository Settings > Pages, set the custom domain to `www.itryketchup.com`.
2. At the DNS provider, add or verify the DNS records listed above.
3. Wait for DNS propagation.
4. Verify `www.itryketchup.com`.
5. Verify `itryketchup.com` redirects or resolves appropriately.
6. Enable Enforce HTTPS only when GitHub Pages allows it.
7. Document the final result in `deploy\DeploymentNotes.md` and README if needed.

## Windows PowerShell Verification Commands

Run these commands after GitHub Pages custom domain and DNS records are configured in Phase 7B:

```powershell
Resolve-DnsName www.itryketchup.com -Type CNAME
Resolve-DnsName itryketchup.com -Type A
Resolve-DnsName itryketchup.com -Type AAAA
```

Optional HTTP checks:

```powershell
Invoke-WebRequest https://www.itryketchup.com -UseBasicParsing
Invoke-WebRequest https://itryketchup.com -UseBasicParsing -MaximumRedirection 5
```

## Expected Propagation Delay

DNS changes may take time to propagate. Some providers update quickly, while others may take several hours. If records do not resolve immediately, wait and re-run the PowerShell verification commands before changing unrelated settings.

## HTTPS Enforcement Notes

GitHub Pages may not allow Enforce HTTPS immediately after the custom domain is added. Wait until GitHub finishes DNS and certificate checks. Enable Enforce HTTPS only when the option becomes available and the custom domain is resolving correctly.

Custom-domain HTTPS is not verified yet. Default GitHub Pages HTTPS is already working at `https://itryketchup.github.io/itryketchup-hub/`.

## Rollback Plan

If custom domain setup fails or causes user-facing issues:

1. Remove the custom domain from repository Settings > Pages.
2. Restore or remove the DNS records that were changed for GitHub Pages.
3. Confirm the default GitHub Pages URL still works: `https://itryketchup.github.io/itryketchup-hub/`.
4. Leave DNS and GitHub Pages in a known-good state before retrying.
5. Document what changed and what was rolled back.

Do not rewrite git history or force push as part of rollback.

## Go / Hold Checklist Before Phase 7B

| Check | Status |
|---|---|
| Default GitHub Pages URL still loads | Go |
| GitHub Pages source is GitHub Actions | Go |
| Latest Pages workflow is successful | Go |
| Privacy verification passed | Go |
| DNS provider access is available | Hold until user confirms |
| User approves custom domain setup | Hold until Phase 7B prompt |
| User approves DNS changes | Hold until Phase 7B prompt |
| No custom domain currently configured | Go |
| No DNS changes made in Phase 7A | Go |
| No CNAME file added in Phase 7A | Go |

Phase 7B should begin only after the user explicitly approves GitHub Pages custom domain setup and DNS changes.
