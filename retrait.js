import "./profil.js";
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const SERVEUR = "https://script.google.com/macros/s/AKfycbytYRN-NW3dUoSeIk5aXf3UvsQ1tqbRkQU9IBwJWYtkWOpgWkCd9U_D5CWyyTx1L7jADA/exec";
const MONTANTS = [1000, 2000, 5000, 10000, 20000, 40000, 60000];

onAuthStateChanged(auth, (user) => {
  if (!user || document.getElementById("carte-retrait")) return;

  const c = document.createElement("div");
  c.id = "carte-retrait";
  c.style.cssText = "max-width:480px;margin:16px auto;padding:16px;border:1px solid rgba(128,128,128,.4);border-radius:12px";

  const options = MONTANTS.map(function (m) {
    return '<option value="' + m + '">' + m.toLocaleString("fr-FR") + " FCFA</option>";
  }).join("");

  c.innerHTML =
    '<h3 style="margin:0 0 12px">Retirer mes gains</h3>' +
    '<select id="r-op" style="width:100%;padding:10px;margin-bottom:8px;font-size:16px"><option>Flooz</option><option>Mixx by Yas</option></select>' +
    '<input id="r-tel" type="tel" placeholder="Numéro de téléphone" style="width:100%;padding:10px;margin-bottom:8px;font-size:16px;box-sizing:border-box">' +
    '<select id="r-montant" style="width:100%;padding:10px;margin-bottom:8px;font-size:16px">' + options + "</select>" +
    '<p style="margin:0 0 8px;font-size:13px;opacity:.8">Un seul retrait par semaine.</p>' +
    '<button id="r-btn" style="width:100%;padding:12px;font-size:16px;border:0;border-radius:8px;cursor:pointer;background:#16a34a;color:#fff">Demander le retrait</button>' +
    '<p id="r-msg" style="margin:10px 0 0"></p>';
  document.body.appendChild(c);

  const btn = document.getElementById("r-btn");
  const msg = document.getElementById("r-msg");

  btn.onclick = async () => {
    const montant = parseInt(document.getElementById("r-montant").value, 10);
    const telephone = document.getElementById("r-tel").value.trim();
    const operateur = document.getElementById("r-op").value;
    if (!MONTANTS.includes(montant)) { msg.textContent = "Choisis un montant dans la liste."; return; }
    if (telephone.length < 8) { msg.textContent = "Numéro invalide"; return; }

    btn.disabled = true;
    msg.textContent = "Envoi en cours...";
    try {
      const idToken = await user.getIdToken();
      const r = await fetch(SERVEUR, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "retrait", idToken, operateur, telephone, montant })
      });
      const d = await r.json();
      msg.textContent = d.ok ? "Demande envoyée. Ton solde a été mis à jour." : d.message;
    } catch (e) {
      msg.textContent = "Erreur de connexion, réessaie.";
    }
    btn.disabled = false;
  };
});
