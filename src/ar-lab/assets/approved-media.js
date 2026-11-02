(() => {
  "use strict";

  // Public derivatives are opt-in. Keep this list empty until the Director approves
  // an exact privacy-reviewed file and it is copied into this governed asset folder.
  window.ONEIROS_APPROVED_MEDIA_SCHEMA = Object.freeze({
    version: "1.0",
    allowedStatus: "Approved for Web",
    assetPrefix: "/ar-lab/assets/approved-media/",
    fields: Object.freeze(["id", "src", "alt", "caption", "component", "status", "approvalRef"])
  });

  window.ONEIROS_APPROVED_MEDIA = Object.freeze([]);
})();
