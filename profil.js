import "./menu.js";
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  const nav = document.getElementById("menu-bas");
  if (!user || !nav || document.getElementById("btn-profil")) return;

  const b = document.createElement("button");
  b.id = "btn-profil";
  b.innerHTML = "<span>👤</span>Profil";
  nav.appendChild(b);

  const fond = document.createElement("div");
  fond.style.cssText = "display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:60;background:rgba(0,0,0,.5);align-items:flex-end;justify-content:center";
  fond.innerHTML =
    '<div style="background:#fff;color:#111;width:100%;max-width:480px;border-radius:16px 16px 0 0;padding:20px;box-sizing:border-box">' +
    '<h3 style="margin:0 0 12px">Mon profil</h3>' +
    '<div id="profil-corps">Chargement...</div>' +
    '<button id="profil-fermer" style="width:100%;margin-top:16px;padding:12px;font-size:16px;border:0;border-radius:8px;background:#16a34a;color:#fff;cursor:pointer">Fermer</button>' +
    "</div>";
  document.body.appendChild(fond);

  const corps = fond.querySelector("#profil-corps");
  const fcfa = function (n) { return (Number(n) || 0).toLocaleString("fr-FR") + " FCFA"; };

  const ligne = function (titre, valeur) {
    const d = document.createElement("div");
    d.style.cssText = "display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #eee";
    const a = document.createElement("span");
    a.textContent = titre;
    const v = document.createElement("strong");
    v.textContent = valeur;
    v.style.cssText = "text-align:right;word-break:break-all";
    d.appendChild(a);
    d.appendChild(v);
    corps.appendChild(d);
  };

  b.onclick = async function () {
    fond.style.display = "flex";
    corps.textContent = "Chargement...";
    let solde = 0;
    let payes = 0;
    try {
      const s = await getDoc(doc(db, "users", user.uid));
      if (s.exists()) {
        solde = s.data().solde;
        payes = s.data().retraitsPayes;
      }
    } catch (e) {
      corps.textContent = "Impossible de charger le profil, réessaie.";
      return;
    }
    corps.textContent = "";
    ligne("E-mail", user.email || "-");
    ligne("Solde", fcfa(solde));
    ligne("Retraits payés", fcfa(payes));
    const cree = user.metadata && user.metadata.creationTime
      ? new Date(user.metadata.creationTime).toLocaleDateString("fr-FR")
      : "-";
    ligne("Membre depuis", cree);
  };

  fond.querySelector("#profil-fermer").onclick = function () { fond.style.display = "none"; };
  fond.onclick = function (e) { if (e.target === fond) fond.style.display = "none"; };
});
