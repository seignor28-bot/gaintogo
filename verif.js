import { auth } from "./firebase-config.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user || user.emailVerified) return;
  if (document.getElementById("carte-verif")) return;

  const c = document.createElement("div");
  c.id = "carte-verif";
  c.style.cssText = "max-width:480px;margin:16px auto;padding:16px;border:1px solid #f5c518;border-radius:12px;background:#fff8e1;color:#222;font-family:inherit";
  c.innerHTML =
    '<h3 style="margin:0 0 8px;font-size:16px">Vérifie ton e-mail</h3>' +
    '<p style="margin:0 0 10px;font-size:14px">Pour retirer tes gains, ton adresse e-mail doit être vérifiée.</p>' +
    '<button id="v-envoyer" style="width:100%;padding:12px;font-size:15px;border:0;border-radius:8px;background:#16a34a;color:#fff;margin-bottom:8px">Envoyer l\'e-mail de vérification</button>' +
    '<button id="v-ok" style="width:100%;padding:12px;font-size:15px;border:1px solid #16a34a;border-radius:8px;background:#fff;color:#16a34a">J\'ai vérifié mon e-mail</button>' +
    '<p id="v-msg" style="margin:10px 0 0;font-size:14px"></p>';
  document.body.appendChild(c);

  const msg = document.getElementById("v-msg");

  document.getElementById("v-envoyer").onclick = async () => {
    msg.textContent = "Envoi en cours...";
    try {
      await sendEmailVerification(user);
      msg.textContent = "E-mail envoyé. Ouvre ta boîte mail (regarde aussi les spams), touche le lien, puis reviens ici.";
    } catch (e) {
      msg.textContent = "Impossible d'envoyer pour l'instant. Réessaie dans quelques minutes.";
    }
  };

  document.getElementById("v-ok").onclick = async () => {
    msg.textContent = "Vérification...";
    try {
      await user.reload();
      if (auth.currentUser && auth.currentUser.emailVerified) {
        c.remove();
      } else {
        msg.textContent = "Ton e-mail n'est pas encore vérifié. Touche d'abord le lien reçu par e-mail.";
      }
    } catch (e) {
      msg.textContent = "Erreur de connexion, réessaie.";
    }
  };
});
