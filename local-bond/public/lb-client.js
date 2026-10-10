// Shared by every Local Bond page. You don't need to edit this file —
// your keys go in config.js.
(function () {
  var c = window.LB_CONFIG || {};
  var missing = !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY ||
    /^YOUR_/.test(c.SUPABASE_URL) || /^YOUR_/.test(c.SUPABASE_ANON_KEY);

  if (missing) {
    var show = function () {
      var d = document.createElement("div");
      d.setAttribute("style",
        "position:fixed;left:0;right:0;top:0;z-index:9999;background:#B3261E;color:#fff;" +
        "padding:14px 18px;font:600 14px/1.4 Arial,sans-serif;text-align:center");
      d.textContent = "Setup needed: open config.js and paste in your Supabase URL and anon key, then upload it again.";
      document.body.appendChild(d);
    };
    if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
  }

  // Placeholder values still produce a client object so the page doesn't crash;
  // calls just fail until config.js is filled in.
  window.supabaseClient = window.supabase.createClient(
    missing ? "https://placeholder.invalid" : c.SUPABASE_URL,
    missing ? "placeholder" : c.SUPABASE_ANON_KEY
  );
})();
