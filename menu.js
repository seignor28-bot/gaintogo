if (!document.getElementById("menu-bas")) {
  const style = document.createElement("style");
  style.textContent =
    "body{padding-bottom:84px}" +
    "#menu-bas{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;background:#fff;border-top:1px solid #ddd;padding-bottom:env(safe-area-inset-bottom,0px)}" +
    "#menu-bas button{flex:1;border:0;background:none;padding:8px 0;font-size:11px;color:#166534;cursor:pointer}" +
    "#menu-bas button span{display:block;font-size:20px}";
  document.head.appendChild(style);

  const aller = function (texte) {
    const cibles = document.querySelectorAll("h1,h2,h3,h4,strong");
    for (const el of cibles) {
      if (el.textContent.includes(texte)) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
  };

  const items = [
    ["🏠", "Accueil", function () { window.scrollTo({ top: 0, behavior: "smooth" }); }],
    ["💰", "Gains", function () { aller("Sondages"); }],
    ["📤", "Retraits", function () {
      const c = document.getElementById("carte-retrait");
      if (c) c.scrollIntoView({ behavior: "smooth", block: "center" });
    }],
    ["🧾", "Historique", function () { aller("Historique"); }]
  ];

  const nav = document.createElement("nav");
  nav.id = "menu-bas";
  items.forEach(function (it) {
    const b = document.createElement("button");
    b.innerHTML = "<span>" + it[0] + "</span>" + it[1];
    b.onclick = it[2];
    nav.appendChild(b);
  });
  document.body.appendChild(nav);
}
