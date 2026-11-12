import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const CPX_APP_ID = "35625";

function fcfa(n) {
  return Number(n || 0).toLocaleString("fr-FR") + " FCFA";
}

function ligne(id, apres) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("p");
    el.id = id;
    el.style.margin = "8px 0";
    apres.insertAdjacentElement("afterend", el);
  }
  return el;
}

onAuthStateChanged(auth, user => {
  if (!user) { location.href = "index.html"; return; }
  document.getElementById("mail").textContent = user.email;
  document.getElementById("cpx").src =
    "https://offers.cpx-research.com/index.php?app_id=" + CPX_APP_ID + "&ext_user_id=" + encodeURIComponent(user.uid);
  onSnapshot(doc(db, "users", user.uid), s => {
    const d = s.exists() ? s.data() : {};
    const solde = document.getElementById("solde");
    solde.textContent = Number(d.solde || 0).toLocaleString("fr-FR");
    try {
      const bloc = solde.parentElement || solde;
      ligne("payes", bloc).textContent = "Retraits payés : " + fcfa(d.retraitsPayes);
    } catch (e) {}
  });
});

document.getElementById("sortir").onclick = async () => {
  await signOut(auth);
  location.href = "index.html";
};

import "./retrait.js";
