/**
 * @fileoverview
 * @namespace login
 * @description Login Page Script
 * Manages the login page functionality, including animations based on window size,
 * and input validation.
 * Handles login form submission and guest login.
 * Resets login parameters on page load.
 * Implements functions to change animations for mobile and desktop modes.
 * Manages session storage for login status.
 * Handles navigation to summary page upon successful login.
 * Implements error handling for invalid login attempts.
 * Manages input field behaviors for login form.
 */

let isStartup = false;

/**
 * @function loginLoaded
 * @memberof login
 * @description Function to be called when the login page is loaded.
 * @returns {void}
 */
function loginLoaded() {
    if (!isStartup) { return; }
    const [height, width] = getCurrentWindowSize();
    width <= 500 ? changeAnimationToMobileMode() : changeAnimationToDesktopMode();
    window.addEventListener('resize', loginResize);
}

/**
 * @function resetUrl
 * @memberof login
 * @description Resets the URL parameters on page load.
 * @return {void}
 */
function resetUrl() {
    let param = new URLSearchParams(document.location.search);
    let pageParam = param.get('isNotStartup');
    const isStartup = pageParam == null || pageParam.length == 0 || pageParam.startsWith('false') ? true : false;
    resetAllParameter();
    if (pageParam != null && pageParam.length > 0) {
        param.delete('isNotStartup');
        window.history.replaceState({}, document.title, '/index.html');
    }
}

/**
 * @function resetAllParameter
 * @memberof login
 * @description Resets all login parameters.
 * Sets email and password input fields to empty and log status to '0'.
 * @returns {void}
 */
function resetAllParameter() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    emailInput.value = '';
    passwordInput.value = '';
    setLogStatus('0');
}

/**
 * @function changeAnimationToMobileMode
 * @memberof login
 * @description Changes the login animation to mobile mode.
 * @returns {void}
 */
function changeAnimationToMobileMode() {
    const loginLogo = document.querySelector('.login-join-logo');
    const loginSection = document.querySelector('.login-section');
    const loginBody = document.querySelector('body');
    loginSection.style.animation = 'startup 500ms ease-in';
    loginLogo.style.animation = 'moveLogoMobile 600ms ease-in-out forwards';
    loginBody.style.animation = 'fadeBackground 600ms ease-in-out forwards';
}

/**
 * @function changeAnimationToDesktopMode
 * @memberof login
 * @description Changes the login animation to desktop mode.
 * @returns {void}
 */
function changeAnimationToDesktopMode() {
    const loginLogo = document.querySelector('.login-join-logo');
    const loginSection = document.querySelector('.login-section');
    loginLogo.style.animation = 'moveLogo 500ms ease-in-out forwards';
    loginSection.style.animation = 'startup 500ms ease-in';
}

/**
 * @function loginResize
 * @memberof login
 * @description Function to be called on window resize event on login page.
 * @returns {void}
 */
function loginResize() {
    const loginLogo = document.querySelector('.login-join-logo');
    const loginBody = document.querySelector('body');
    const loginSection = document.querySelector('.login-section');
    loginLogo.style.animation = 'none';
    loginBody.style.animation = 'none';
    loginSection.style.animation = 'none';
}

/**
 * @function loginFormSubmit
 * @memberof login
 * @description Function to be called on login form submission.
 * @param {Event} event
 * @return {void}
 */
function loginFormSubmit(event) {
    event.preventDefault();
    let signIn = new FormData(event.target);
    let email = signIn.get("email");
    let password = signIn.get("password");
    checkLogin(email, password);
};

/**
 * @function loginInputFieldsOnInput
 * @memberof login
 * @description Function to be called on login input fields.
 * @param {HTMLElement} input 
 * @returns {void}
 */
function loginInputFieldsOnInput(input) {
    if (!input) { return; }

    if (input.value && input.value.length >= 3) {
        removeErrorMessage('login-error-text');
    }
}

/**
 * @function loginInputFieldsOnBlur
 * @memberof login
 * @description Function to be called on login input fields.
 * @param {HTMLElement} input 
 * @returns {void}
 */
function loginInputFieldsOnBlur(input) {
    if (!input) { return; }
    if (input.value && input.value.length >= 3) {
        toggleBorderColorByError(input.id, true);
    } else {
        toggleBorderColorByError(input.id, false);
    }
}

/**
 * @function checkLogin
 * @memberof login
 * @description Function to check login credentials.
 * Redirects to summary page on success, shows error on failure.
 * Reads user data from Firebase.
 * @param {string} email 
 * @param {string} password 
 * @return {Promise<void>}
 */
async function checkLogin(email, password) {
    const fb = new FirebaseDatabase();
    const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    if (logInUser && logInUser.password === password && logInUser.email === email) {
        setLogStatus(logInUser.id);
        navigateToSummary(null, true);
    } else {
        setLogStatus('0');
        toggleBorderColorByError();
        document.getElementById("password").value = '';
        showErrorMessage('login-error-text');
    }
};

/**
 * @function loginGuest
 * @memberof login
 * @description Function to login as guest.
 * Sets log status to 'Guest' and navigates to summary page.
 * @returns {void}
 */
function loginGuest() {
    setLogStatus('Guest');
    navigateToSummary(null, true);
};






