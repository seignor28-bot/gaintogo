const BASE = location.origin + "/gaintogo/";

const icone = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#16a34a"/><text x="256" y="340" font-size="280" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle" fill="#fff">G</text></svg>'
);

const manifeste = {
  name: "GainTogo",
  short_name: "GainTogo",
  start_url: BASE + "dashboard.html",
  scope: BASE,
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#16a34a",
  icons: [{ src: icone, sizes: "any", type: "image/svg+xml", purpose: "any" }]
};

if (!document.querySelector('link[rel="manifest"]')) {
  const lien = document.createElement("link");
  lien.rel = "manifest";
  lien.href = URL.createObjectURL(new Blob([JSON.stringify(manifeste)], { type: "application/manifest+json" }));
  document.head.appendChild(lien);

  const meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.content = "#16a34a";
  document.head.appendChild(meta);
}

const dejaInstalle = window.matchMedia("(display-mode: standalone)").matches;
let evt = null;
let bouton = null;

window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  evt = e;
  if (dejaInstalle || bouton) return;

  bouton = document.createElement("button");
  bouton.textContent = "📲 Installer GainTogo";
  bouton.style.cssText = "position:fixed;right:12px;bottom:84px;z-index:55;padding:10px 14px;font-size:14px;border:0;border-radius:20px;background:#16a34a;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer";
  bouton.onclick = async function () {
    if (!evt) return;
    evt.prompt();
    await evt.userChoice;
    evt = null;
    bouton.remove();
    bouton = null;
  };
  document.body.appendChild(bouton);
});

window.addEventListener("appinstalled", function () {
  if (bouton) { bouton.remove(); bouton = null; }
});
