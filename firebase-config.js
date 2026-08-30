// ========================================
// FIREBASE CONFIG
// File ini menghubungkan website ke project Firebase kamu.
// Dipakai bareng oleh admin.html dan halaman lain yang
// butuh baca data dari Firestore.
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_fe29gvHtPd_JuC8gTyuObFXzrNAVcxw",
  authDomain: "ram-website-d1b27.firebaseapp.com",
  projectId: "ram-website-d1b27",
  storageBucket: "ram-website-d1b27.firebasestorage.app",
  messagingSenderId: "1086332744517",
  appId: "1:1086332744517:web:ea829ea0d0788f9dc4c42c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
