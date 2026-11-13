import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function libelle(s) {
  const t = String(s || "").toLowerCase();
  if (t === "1" || t === "gain" || t === "credit") return "Gain sondage reçu";
  if (t === "bonus") return "Bonus quotidien reçu";
  if (t === "retrait_reserve") return "Retrait demandé";
  if (t === "retrait_rembourse") return "Retrait remboursé";
  if (t === "retrait_paye") return "Retrait payé";
  return null;
}

function afficher(texte) {
  const d = document.createElement("div");
  d.textContent = "🔔 " + texte;
  d.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);max-width:90%;z-index:70;padding:12px 16px;border-radius:12px;background:#16a34a;color:#fff;font-size:15px;box-shadow:0 4px 12px rgba(0,0,0,.3)";
  document.body.appendChild(d);
  setTimeout(function () { d.remove(); }, 4500);
}

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  let premier = true;
  onSnapshot(query(collection(db, "transactions"), where("uid", "==", user.uid)), (snap) => {
    if (premier) { premier = false; return; }
    snap.docChanges().forEach(function (ch) {
      if (ch.type !== "added") return;
      const t = ch.doc.data();
      const l = libelle(t.statut);
      if (!l) return;
      const m = Number(t.montant || 0);
      afficher(l + (m ? " : " + (m > 0 ? "+" : "") + m.toLocaleString("fr-FR") + " FCFA" : ""));
    });
  });
});
