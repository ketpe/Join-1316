/**
 * @namespace script
 * @description Common functions for the application
 * Loaded by all pages
 */

const emailPattern = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/i;

/**
 * Set onclick event to document body to close submenu when clicking outside
*/
setOnClickEventToDocument();

/**
 * Initialize the webpage by including HTML components and rendering user initials.
 * @function init
 * @memberof script
 * @returns {Promise<void>}
 */
async function init() {
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html")
    ]);

    renderUserInitial();

}

/**
 * Render the user's initial in the UI.
 * @function renderUserInitial
 * @memberof script
 * @returns {Promise<void>}

 */
async function renderUserInitial() {
    let logInStatus = getLogStatus();
    let userinitial = "G";
    if (logInStatus !== "0" && logInStatus !== "Guest") {
        const fb = new FirebaseDatabase();
        const userinitialRef = await fb.getFirebaseLogin(() => fb.getDataByKey('id', logInStatus, 'contacts'));
        userinitial = userinitialRef.initial;
    }
    let renderUserInitialRef = document.getElementById("user-initial-render");
    renderUserInitialRef.textContent = userinitial;
}

/**
 * Set onclick event to document body to close submenu when clicking outside
 * @function setOnClickEventToDocument
 * @memberof script
 * @return {void}

 */
function setOnClickEventToDocument() {
    const body = document.querySelector('body');
    body.setAttribute('onclick', 'subMenuClose(event)');
}



/**
 * Show submenu in desktop or mobile mode
 * @function showSubmenu
 * @memberof script
 * @param {string} id
 * @param {Event} event
 * @param {string} desktopOrMobile
 * @returns {void}
 * 
 */
function showSubmenu(id, event, desktopOrMobile) {
    if (event) event.stopPropagation();
    const subMenu = document.getElementById(id);

    if (desktopOrMobile == "desktop") {
        subMenu.classList.toggle('d-none');
    }

    if (desktopOrMobile == "mobile") {
        subMenu.classList.toggle('is-submenu-mobile-open');
    }

};

/**
 * Prevent event bubbling.
 * @function noBubbling
 * @memberof script
 * @param {Event} event
 * @returns {void}
 * 
 */
function noBubbling(event) {
    event.stopPropagation()
};

/**
 * Close the submenu when clicking outside of it
 * @function subMenuClose
 * @memberof script
 * @param {Event} event
 * @returns {void}
 * 
 */
function subMenuClose(event) {

    let subMenu = document.getElementById('subMenu')
    if (!subMenu) { return; }
    const desktopOrMobile = subMenu.getAttribute('data-dOrM');

    if (desktopOrMobile == "desktop" && !subMenu.classList.contains('d-none') && !subMenu.contains(event.target)) {
        subMenu.classList.add('d-none');
    } else if (desktopOrMobile == "mobile" && subMenu.classList.contains('is-submenu-mobile-open') && !subMenu.contains(event.target)) {
        subMenu.classList.remove('is-submenu-mobile-open');
    }
}

/**
 * Show an error message for a specific element.
 * @function showErrorMessage
 * @memberof script
 * @param {String} elementId
 * @param {String} errorMessage
 * @return {void}
 * 
 */
function showErrorMessage(elementId, errorMessage = "") {
    let errorText = document.getElementById(elementId);
    if (errorText.classList.contains('d-none')) {
        errorText.classList.remove("d-none");
        if (errorMessage.length > 0) {
            errorText.textContent = errorMessage;
        }
    }
}

/**
 * Remove the error message for a specific element.
 * @function removeErrorMessage
 * @memberof script
 * @param {String} elementId
 * @return {void}
 * 
 */
function removeErrorMessage(elementId) {
    let errorText = document.getElementById(elementId);
    if (!errorText.classList.contains('d-none')) {
        errorText.classList.add("d-none")
    };
}

/**
 * Get a random color class from the predefined list.
 * @function getRandomColor
 * @memberof script
 * @returns {String} A random color class.
 * 
 */
function getRandomColor() {
    const colorClasses = [
        'orange', 'violet', 'coral', 'gold', 'lemon', 'red', 'blue',
        'peach', 'cyan', 'pink', 'indigo', 'mint', 'magenta', 'lime', 'amber'
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

/**
 * Generates a new unique identifier (UUID).
 * @function getNewUid
 * @memberof script
 * @returns {string} A new UUID.
 * 
 */
function getNewUid() {
    return crypto.randomUUID();
}

/**
 * Toggles the visibility of the password input field.
 * @function togglePasswordVisibility
 * @memberof script
 * @param {Number} toggleCounter 
 * @param {String} passwortInputID 
 * @param {String} toggleIconID 
 * @return {void}
 * 
 */
function togglePasswordVisibility(toggleCounter, passwortInputID, toggleIconID) {
    let passwordInput = document.getElementById(passwortInputID);
    let toggleIcon = document.getElementById(toggleIconID);
    let togglePasswordVisibilityArray = {
        1: ["login-password-lock", "login-password-visible-off", 2, "password"],
        2: ["login-password-visible-off", "login-password-visible-on", 3, "text"],
        3: ["login-password-visible-on", "login-password-lock", 1, "password"],
    };
    if (togglePasswordVisibilityArray[toggleCounter]) {
        let [from, to, next, type] = togglePasswordVisibilityArray[toggleCounter];
        toggleIcon.classList.replace(from, to);
        passwordInput.type = type;
        toggleIcon.onclick = () => togglePasswordVisibility(next, passwortInputID, toggleIconID);
    };
}

/**
 * Toggles the border color of an element based on field has validation error.
 * @function toggleBorderColorByError
 * @memberof script
 * @param {String} elementId 
 * @param {Boolean} loginErrorBorder 
 * @return {void}
 * 
 */
function toggleBorderColorByError(elementId = null, loginErrorBorder = false) {
    const elements = elementId
        ? [document.getElementById(elementId)].filter(Boolean)
        : document.querySelectorAll(".login-signup-input, .login-error-border");

    elements.forEach(el => {
        loginErrorBorder
            ? el.classList.remove("login-error-border")
            : el.classList.add("login-error-border");
    });
}

/** Get the current window size.
 * @function getCurrentWindowSize
 * @memberof script
 * @returns {number[]} An array containing the height and width of the window.
 * 
 */
function getCurrentWindowSize() {
    return [window.innerHeight, window.innerWidth];
}

/**
 * Check if user or guest is logged in, if not navigate to login page.
 * @function checkUserOrGuestIsloggedIn
 * @memberof script
 * @return {void}
 * 
 */
function checkUserOrGuestIsloggedIn() {
    let logInStatus = getLogStatus();
    if (logInStatus == "0") {
        navigateToLogin();
    }
}

/**
 * Shows a loading overlay.
 * @function showOverlay
 * @memberof script
 * @returns {void}
 * 
 */
function showOverlay(){
    const overlay = document.getElementById('loadingOverlay');
    if(!overlay){return;}
    overlay.classList.add('is-loading-visible');
}

/**
 * Hides the loading overlay.
 * @function hideOverlay
 * @memberof script
 * @returns {void}
 * 
 */
function hideOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if(!overlay){return;}
    overlay.classList.remove('is-loading-visible');
}

/**
 * Shows a loading animation.
 * @function showLoadingAnimation
 * @memberof script
 * @returns {void}
 * 
 */
function showLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    const loadingContainer = document.getElementById('loadingContainer');
    if (!overlay || !loadingContainer) { return; }
    overlay.classList.add('loading-color');
    overlay.classList.add('is-loading-visible');
    loadingContainer.classList.remove('visually-hidden');
}

/**
 * Hides the loading animation after a short delay.
 * @function hideLoadingAnimation
 * @memberof script
 * @returns {void}
 * 
 */
function hideLoadingAnimation() {
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        const loadingContainer = document.getElementById('loadingContainer');
        if (!overlay || !loadingContainer) { return; }
        overlay.classList.remove('is-loading-visible');
        loadingContainer.classList.add('visually-hidden');
    }, 500);
}

/**
 * Checks if the provided email is valid according to RFC standards.
 * Validates length, format, and domain rules.
 * @function emailValidator
 * @memberof signup
 * @description Validate email format according to RFC standards.
 * @param {string} email
 * @returns {boolean}
 */
function emailValidator(email) {
    if (email.length > 254) { return false; }
    if (/\.{2,}/.test(email)) { return false; }
    if (!emailPattern.test(email)) { return false; }
    const [local, domain] = email.split('@');
    if (!local || !domain) return false;
    if (local.length > 64) return false;
    if (domain.startsWith('-') || domain.endsWith('-')) return false;
    if (domain.split('.').some(part => !part || part.length > 63)) return false;
    return true;
}

/**
 * @function checkEmailInDatabase
 * @memberof signup
 * @description Check if the email exists in the database.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function checkEmailInDatabase(email) {
    let fb = new FirebaseDatabase();
    let found = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    return found ? true : false;
}