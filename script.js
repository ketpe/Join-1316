
setOnClickEventToDocument();

async function init() {
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html")
    ]);

    renderUserInitial();
    
}

async function renderUserInitial() {
    let logInStatus = getLogStatus();
    let userinitial = "G";
    if (logInStatus !== "0") {
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

    if(desktopOrMobile == "desktop"){
        subMenu.classList.toggle('d-none');
    }
    
    if(desktopOrMobile == "mobile"){
        subMenu.classList.toggle('is-submenu-mobile-open');
    }
    
};

/**
 *
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
function subMenuClose(event){

    let subMenu = document.getElementById('subMenu')
    if(!subMenu){return;}
    const desktopOrMobile = subMenu.getAttribute('data-dOrM');

    if (desktopOrMobile == "desktop" && !subMenu.classList.contains('d-none') && !subMenu.contains(event.target)) {
        subMenu.classList.add('d-none');
    }else if(desktopOrMobile == "mobile" && subMenu.classList.contains('is-submenu-mobile-open') && !subMenu.contains(event.target)){
        subMenu.classList.remove('is-submenu-mobile-open');
    }
}


function showErrorMessage(elementId, errorMessage="") {
    let errorText = document.getElementById(elementId);
    if(errorText.classList.contains('d-none')){
        errorText.classList.remove("d-none");
        if(errorMessage.length > 0){
            errorText.textContent = errorMessage;
        }   
    }
}

function removeErrorMessage(elementId) {
    let errorText = document.getElementById(elementId);
    if(!errorText.classList.contains('d-none')) {
        errorText.classList.add("d-none")
    };
}

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

function checkUserOrGuestIsloggedIn() {
    let logInStatus = getLogStatus();
    if(logInStatus == "0"){
        navigateToLogin();
    }
}

