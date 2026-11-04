import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const CPX_APP_ID = "35625";

onAuthStateChanged(auth, user => {
  if (!user) { location.href = "index.html"; return; }
  document.getElementById("mail").textContent = user.email;
  document.getElementById("cpx").src =
    "https://offers.cpx-research.com/index.php?app_id=" + CPX_APP_ID + "&ext_user_id=" + encodeURIComponent(user.uid);
  onSnapshot(doc(db, "users", user.uid), s => {
    const v = s.exists() ? (s.data().solde || 0) : 0;
    document.getElementById("solde").textContent = Number(v).toLocaleString("fr-FR");
  });
});

document.getElementById("sortir").onclick = async () => {
  await signOut(auth);
  location.href = "index.html";
};
