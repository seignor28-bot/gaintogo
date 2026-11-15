import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let mode = "connexion";
let enCours = false;
const $ = id => document.getElementById(id);
const msg = (t, err) => { $("msg").textContent = t; $("msg").className = "msg" + (err ? " erreur" : ""); };

function choisir(m){
  mode = m;
  $("t-connexion").classList.toggle("actif", m === "connexion");
  $("t-inscription").classList.toggle("actif", m === "inscription");
  $("envoyer").textContent = m === "connexion" ? "Se connecter" : "Créer mon compte";
  $("mdp").autocomplete = m === "connexion" ? "current-password" : "new-password";
  msg("");
}
$("t-connexion").onclick = () => choisir("connexion");
$("t-inscription").onclick = () => choisir("inscription");

const erreurs = {
  "auth/invalid-email": "Adresse e-mail invalide.",
  "auth/missing-password": "Entrez votre mot de passe.",
  "auth/weak-password": "Mot de passe trop court : 6 caractères minimum.",
  "auth/email-already-in-use": "Cette adresse a déjà un compte. Choisissez « Se connecter ».",
  "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
  "auth/user-not-found": "Aucun compte avec cette adresse.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/too-many-requests": "Trop d'essais. Réessayez dans quelques minutes.",
  "auth/network-request-failed": "Pas de connexion internet.",
  "auth/unauthorized-domain": "Ce site n'est pas encore autorisé dans Firebase (domaines autorisés)."
};

async function creerFiche(user, email) {
  const ref = doc(db, "users", user.uid);
  const existe = await getDoc(ref);
  if (!existe.exists()) {
    await setDoc(ref, { email: email, solde: 0, createdAt: serverTimestamp() });
  }
}

$("envoyer").onclick = async () => {
  const email = $("email").value.trim(), mdp = $("mdp").value;
  $("envoyer").disabled = true; msg("Un instant…");
  enCours = true;
  try {
    let c;
    if (mode === "inscription") {
      c = await createUserWithEmailAndPassword(auth, email, mdp);
    } else {
      c = await signInWithEmailAndPassword(auth, email, mdp);
    }
    await creerFiche(c.user, email);
    location.href = "dashboard.html";
  } catch (e) {
    enCours = false;
    msg(erreurs[e.code] || "Erreur : " + (e.code || e.message), true);
    $("envoyer").disabled = false;
  }
};

$("oubli").onclick = async () => {
  const email = $("email").value.trim();
  if (!email) return msg("Entrez d'abord votre e-mail ci-dessus.", true);
  try { await sendPasswordResetEmail(auth, email); msg("E-mail de réinitialisation envoyé."); }
  catch (e) { msg(erreurs[e.code] || "Erreur : " + e.code, true); }
};

onAuthStateChanged(auth, u => { if (u && !enCours) location.href = "dashboard.html"; });
