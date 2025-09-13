import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { firebaseConfig } from "../config/firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

signInAnonymously(auth).catch(err => console.error("Login-Fehler:", err));

export { auth, db, onAuthStateChanged };