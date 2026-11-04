import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3XMmNZ9KomS838QXTWnLEwwfJDJqJUwA",
  authDomain: "gaintogo-1a1bc.firebaseapp.com",
  projectId: "gaintogo-1a1bc",
  storageBucket: "gaintogo-1a1bc.firebasestorage.app",
  messagingSenderId: "486505663607",
  appId: "1:486505663607:web:780b0e5001069894b60a72",
  measurementId: "G-6MQ4EN8ERF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
