import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// À REMPLACER par les valeurs de votre console Firebase (projet gaintogo-1a1bc)
const firebaseConfig = {
  apiKey: "COLLEZ_ICI_apiKey",
  authDomain: "gaintogo-1a1bc.firebaseapp.com",
  projectId: "gaintogo-1a1bc",
  storageBucket: "gaintogo-1a1bc.firebasestorage.app",
  messagingSenderId: "COLLEZ_ICI_messagingSenderId",
  appId: "COLLEZ_ICI_appId"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
