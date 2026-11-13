import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const SERVEUR = "https://script.google.com/macros/s/AKfycbytYRN-NW3dUoSeIk5aXf3UvsQ1tqbRkQU9IBwJWYtkWOpgWkCd9U_D5CWyyTx1L7jADA/exec";

onAuthStateChanged(auth, (user) => {
  if (!user || document.getElementById("carte-bonus")) return;

  const c = document.createElement("div");
  c.id = "carte-bonus";
  c.style.cssText = "max-width:480px;margin:16px auto;padding:16px;border:1px solid rgba(128,128,128,.4);border-radius:12px;text-align:center";
  c.innerHTML =
    '<h3 style="margin:0 0 8px">🎁 Bonus du jour</h3>' +
    '<p style="margin:0 0 10px;font-size:14px;opacity:.85">Reçois un bonus gratuit chaque jour en te connectant.</p>' +
    '<button id="b-btn" style="width:100%;padding:12px;font-size:16px;border:0;border-radius:8px;cursor:pointer;background:#f59e0b;color:#fff">Récupérer mon bonus</button>' +
    '<p id="b-msg" style="margin:10px 0 0"></p>';

  let essais = 0;
  const t = setInterval(function () {
    const r = document.getElementById("carte-retrait");
    essais++;
    if (r) {
      r.parentNode.insertBefore(c, r);
      clearInterval(t);
    } else if (essais > 20) {
      document.body.appendChild(c);
      clearInterval(t);
    }
  }, 250);

  const btn = c.querySelector("#b-btn");
  const msg = c.querySelector("#b-msg");

  btn.onclick = async () => {
    btn.disabled = true;
    msg.textContent = "Envoi en cours...";
    try {
      const idToken = await user.getIdToken();
      const r = await fetch(SERVEUR, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "bonus", idToken })
      });
      const d = await r.json();
      msg.textContent = d.message || "Réponse inattendue";
      if (d.ok) setTimeout(function () { location.reload(); }, 1800);
    } catch (e) {
      msg.textContent = "Erreur de connexion, réessaie.";
    }
    btn.disabled = false;
  };
});
