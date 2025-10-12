
import { auth, db, onAuthStateChanged } from "./scripts/firebase.js";
import { ref, set, get, getDatabase, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/**
 * Includes HTML content into a target element.
 * @param {string} targetId 
 * @param {string} file 
 * @returns {Promise<Element|string>}
 */
async function includeHtml(targetId, file) {

  try {
    const element = document.getElementById(targetId);
    if (!element) throw new Error(`Target #${targetId} not found`);
    element.innerHTML = "";

    const res = await fetch(file, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Error loading: ${file} (${res.status})`);

    const html = await res.text();
    element.innerHTML = html;

    return element;
  } catch (error) {
    return error.message;
  }

}

/**
 * Includes HTML content into a specified node.
 * @param {string} nodeName 
 * @param {string} file 
 * @returns {Promise<Element|string>}     
 */
async function includeHtmlForNode(nodeName, file) {

  try {
    const element = document.querySelector(nodeName);
    if (!element) throw new Error(`Node #${nodeName} not found`);
    element.innerHTML = "";

    const res = await fetch(file, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Error loading: ${file} (${res.status})`);

    const html = await res.text();
    element.innerHTML = html;

    return element;
  } catch (error) {
    return error.message;
  }

}

/** Sets the login status in session storage.
 * @param {string} setLogStatus 
 */
function setLogStatus(setLogStatus) {
  sessionStorage.setItem('logInStatus', setLogStatus);
};

/**
 * Gets the current login status from session storage.
 * @returns {string}  The current login status from session storage.
 * Redirects to the login page if no status is found.
 */
function getLogStatus() {
  let logInStatus = sessionStorage.getItem('logInStatus');
  if (!logInStatus) {
    window.location.href = './index.html';
    return;
  }
  return logInStatus;
};


window.includeHtml = includeHtml;
window.includeHtmlForNode = includeHtmlForNode;
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
window.setLogStatus = setLogStatus;
window.getLogStatus = getLogStatus;

