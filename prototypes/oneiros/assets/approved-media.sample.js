(() => {
  "use strict";

  // Local prototype contract only. Keep this array empty until an exact optimized
  // derivative is separately approved and copied into a governed prototype asset folder.
  window.ONEIROS_APPROVED_MEDIA_SCHEMA = Object.freeze({
    version: "1.0",
    allowedStatus: "Approved for Web",
    assetPrefix: "../assets/approved-media/",
    fields: Object.freeze([
      "id", "src", "alt", "caption", "component", "category",
      "journalCategory", "status", "approvalRef"
    ])
  });

  window.ONEIROS_APPROVED_MEDIA = Object.freeze([]);
})();
