import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const CPX_APP_ID = "35625";

function fcfa(n) {
  return Number(n || 0).toLocaleString("fr-FR") + " FCFA";
}

function laDate(v) {
  try {
    if (v && typeof v.toDate === "function") return v.toDate();
    if (v === undefined || v === null || v === "") return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  } catch (e) { return null; }
}

function libelle(s) {
  const t = String(s || "").toLowerCase();
  if (t === "1" || t === "gain" || t === "credit") return "Gain sondage";
  if (t === "retrait_reserve") return "Retrait demandé";
  if (t === "retrait_rembourse") return "Retrait remboursé";
  if (t === "retrait_paye") return "Retrait payé" if (t === "bonus") return "Bonus quotidien"; 
  if (t.indexOf("annul") !== -1) return "Gain annulé";
  return s ? String(s) : "Transaction";
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

function blocHistorique(apres) {
  let el = document.getElementById("historique");
  if (!el) {
    el = document.createElement("div");
    el.id = "historique";
    el.style.cssText = "background:#fff;color:#222;border-radius:16px;padding:16px;margin:16px 0;box-shadow:0 2px 8px rgba(0,0,0,.08)";
    apres.insertAdjacentElement("afterend", el);
  }
  return el;
}

onAuthStateChanged(auth, user => {
  if (!user) { location.href = "index.html"; return; }
  document.getElementById("mail").textContent = user.email;
  document.getElementById("cpx").src =
    "https://offers.cpx-research.com/index.php?app_id=" + CPX_APP_ID + "&ext_user_id=" + encodeURIComponent(user.uid);

  const solde = document.getElementById("solde");
  const bloc = solde.parentElement || solde;

  onSnapshot(doc(db, "users", user.uid), s => {
    const d = s.exists() ? s.data() : {};
    solde.textContent = Number(d.solde || 0).toLocaleString("fr-FR");
    try {
      ligne("payes", bloc).textContent = "Retraits payés : " + fcfa(d.retraitsPayes);
    } catch (e) {}
  });

  onSnapshot(query(collection(db, "transactions"), where("uid", "==", user.uid)), snap => {
    try {
      const liste = [];
      snap.forEach(x => liste.push(x.data()));
      liste.sort((a, b) => {
        const da = laDate(a.date), dbb = laDate(b.date);
        return (dbb ? dbb.getTime() : 0) - (da ? da.getTime() : 0);
      });

      const debut = new Date(); debut.setHours(0, 0, 0, 0);
      let jour = 0;
      liste.forEach(t => {
        const d = laDate(t.date);
        const m = Number(t.montant || 0);
        const st = String(t.statut || "").toLowerCase();
        const gain = st === "1" || st === "gain" || st === "credit"|| st === "bonus" ;
        if (d && d >= debut && m > 0 && gain) jour += m;
      });

      const payes = document.getElementById("payes");
      ligne("gainsjour", payes || bloc).textContent = "Gains aujourd'hui : " + fcfa(jour);

      const h = blocHistorique(bloc.parentElement || bloc);
      h.innerHTML = "";
      const titre = document.createElement("strong");
      titre.textContent = "Historique";
      h.appendChild(titre);

      if (liste.length === 0) {
        const vide = document.createElement("p");
        vide.textContent = "Aucune transaction pour le moment.";
        vide.style.color = "#666";
        h.appendChild(vide);
      }
      liste.slice(0, 10).forEach(t => {
        const d = laDate(t.date);
        const m = Number(t.montant || 0);
        const l = document.createElement("div");
        l.style.cssText = "display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid #eee";
        const g = document.createElement("span");
        g.textContent = (d ? d.toLocaleDateString("fr-FR") + " · " : "") + libelle(t.statut);
        const r = document.createElement("span");
        r.textContent = m === 0 ? "—" : (m > 0 ? "+" : "") + fcfa(m);
        r.style.color = m < 0 ? "#c0392b" : (m > 0 ? "#1e8449" : "#666");
        l.appendChild(g);
        l.appendChild(r);
        h.appendChild(l);
      });
    } catch (e) {}
  }, () => {});
});

document.getElementById("sortir").onclick = async () => {
  await signOut(auth);
  location.href = "index.html";
};

import "./retrait.js";
