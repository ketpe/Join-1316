/**
 * @namespace firebase
 * @description Firebase initialization and authentication.
 * This script initializes the Firebase app using the provided configuration
 * and sets up anonymous authentication. It exports the authentication
 * and database instances for use in other parts of the application.
 * @module scripts/firebase
 * @requires module:config/firebaseConfig
 * @requires module:firebase/app
 * @requires module:firebase/auth
 * @requires module:firebase/database
 * @exports auth - The Firebase Authentication instance.
 * @exports db - The Firebase Realtime Database instance.
 * @exports onAuthStateChanged - Function to monitor authentication state changes.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { firebaseConfig } from "../config/firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

signInAnonymously(auth).catch(err => console.error("Login-Fehler:", err));

/**
 * @function onAuthStateChanged
 * Monitors authentication state changes.
 * @param {function} callback - The callback function to execute on auth state change.
 */
export { auth, db, onAuthStateChanged };