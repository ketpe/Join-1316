/**
 * Set onclick event to document body to close submenu when clicking outside
*/
setOnClickEventToDocument();

/**
 * Initialize the webpage by including HTML components and rendering user initials.
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
 */
function setOnClickEventToDocument() {
    const body = document.querySelector('body');
    body.setAttribute('onclick', 'subMenuClose(event)');
}



/**
 * Show submenu in desktop or mobile mode
 * @param {*} id
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
 * @param {*} event
 */
function noBubbling(event) {
    event.stopPropagation()
};

/**
 * Close the submenu when clicking outside of it
 * @param {*} event
 * @returns
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
 * @param {String} elementId
 * @param {String} errorMessage
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
 * @param {String} elementId
 */
function removeErrorMessage(elementId) {
    let errorText = document.getElementById(elementId);
    if (!errorText.classList.contains('d-none')) {
        errorText.classList.add("d-none")
    };
}

/**
 * Get a random color class from the predefined list.
 * @returns {String} A random color class.
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
 * @returns {string} A new UUID.
 */
function getNewUid() {
    return crypto.randomUUID();
}

/**
 * Toggles the visibility of the password input field.
 * @param {Number} toggleCounter 
 * @param {String} passwortInputID 
 * @param {String} toggleIconID 
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
 * @param {String} elementId 
 * @param {Boolean} loginErrorBorder 
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
 * @returns {number[]} An array containing the height and width of the window.
 */
function getCurrentWindowSize() {
    return [window.innerHeight, window.innerWidth];
}

/**
 * Check if user or guest is logged in, if not navigate to login page.
 */
function checkUserOrGuestIsloggedIn() {
    let logInStatus = getLogStatus();
    if (logInStatus == "0") {
        navigateToLogin();
    }
}

function showOverlay(){
    const overlay = document.getElementById('loadingOverlay');
    if(!overlay){return;}
    overlay.classList.add('is-loading-visible');
}

function hideOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if(!overlay){return;}
    overlay.classList.remove('is-loading-visible');
}

function showLoadingAninmation() {
    const overlay = document.getElementById('loadingOverlay');
    const loadingContainer = document.getElementById('loadingContainer');
    if (!overlay || !loadingContainer) { return; }
    overlay.classList.add('loading-color');
    overlay.classList.add('is-loading-visible');
    loadingContainer.classList.remove('visually-hidden');
}

function hideLoadingAninmation() {
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        const loadingContainer = document.getElementById('loadingContainer');
        if (!overlay || !loadingContainer) { return; }
        overlay.classList.remove('is-loading-visible');
        loadingContainer.classList.add('visually-hidden');
    }, 500);
}