
import { auth, db, onAuthStateChanged } from "./scripts/firebase.js";
import { ref, push, set, onValue, get, getDatabase, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

async function includeHtml(targetId, file) {

  try {
    const element = document.getElementById(targetId);
    if (!element) throw new Error(`Target #${targetId} not found`);

    const res = await fetch(file, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Error loading: ${file} (${res.status})`);

    const html = await res.text();
    element.innerHTML = html;

    return element;
  } catch (error) {
    return error.message;
  }


}


window.includeHtml = includeHtml;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseOnAutheChanged = onAuthStateChanged;
window.firebaseGetDatabase = getDatabase;
window.firebaseGet = get;
window.firebaseRef = ref;
window.firebaseChild = child;
window.firebaseSet = set;
window.firebaseUpdate = update;
window.firebaseRemove = remove;
