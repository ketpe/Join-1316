/**
 * Navigations between pages
 * This function handles the navigation to the sign-up page.
 * It changes the current window location to the sign-up page URL.
 * @returns {void}
 */
function navigateToSignUp() {
    window.location.href = './signup.html';
}

/**
 * Navigates to the summary page.
 * @param {*} button
 * @returns {void}
 */
function navigateToSummary(button, isFromLogin=false) {

    if (button) {
        if (button.getAttribute('data-active') == "true") { return; }
    }

    window.location.href =  isFromLogin ? './summary.html?isNotStartup=true' : './summary.html';
}

/**
 * Navigates to the contact page.
 * @param {*} button
 * @returns {void}
 */
function navigateToContact(button) {
    if (button.getAttribute('data-active') == "true") { return; }
    window.location.href = './contacts.html';
}

/**
 * Navigates to the privacy policy page.
 * @param {*} event
 * @param {*} login
 */
function navigateToPrivacy(event, login = "") {

    if (login == "login") {
        window.location.href = `./privacyPolicy.html?backToLogin=true`;
    } else {
        window.location.href = `./privacyPolicy.html?backToLogin=false`;
    }

}

/**
 *  Navigates to the legal notice page.
 * @param {*} event
 * @param {*} loginOrSignin
 */
function navigateToLegalNotice(event, loginOrSignin = "") {

    if (loginOrSignin == "login" || loginOrSignin == "signin") {
        window.location.href = `./legalNotice.html?backToLogin=true`;
    } else {
        window.location.href = `./legalNotice.html?backToLogin=false`;
    }
}

/**
 * Navigates to the login page and sets the log status to '0'.
 * This function changes the current window location to the login page URL.
 * It also updates the log status in local storage to indicate that the user is logged out.
 * @returns {void}
 */
function navigateToLogin() {
    setLogStatus('0');
    window.location.href = './index.html?isNotStartup=true';
}

/**
 * Navigates to the help page.
 * @returns {void}
 */
function navigateToHelp() {
    window.location.href = './help.html';
}

/**
 * Navigates to the add task page.
 * @param {*} button
 * @returns {void}
 */
function navigateToAddTask(button) {
    if (button) {
        if (button.getAttribute('data-active') == "true") { return; }
    }

    window.location.href = './addTask.html';
}

/**
 * Navigates to the board page.
 * @param {*} button
 * @returns {void}
 */
function navigateToBoard(button) {
    if (button) {
        if (button.getAttribute('data-active') == "true") { return; }
    }

    window.location.href = './board.html';
}

/**
 * Sets the active state of the navigation button based on the current view.
 * This function updates the button's appearance and state to reflect the active view.
 * @param {*} viewName
 * @param {*} desktopOrMobile
 * @returns
 */
function setNavigationButtonActive(viewName, desktopOrMobile) {
    if (desktopOrMobile.length == 0 || viewName.length == 0) { return; }
    const activeClass = desktopOrMobile == "desktop" ? 'nav-desktop-btn-active' : 'nav-mobile-btn-active';
    const btnContainer = desktopOrMobile == 'desktop' ? '.nav-desktop-menu' : '.nav-mobile-menu';

    const buttons = getNavButtons(btnContainer);
    if (!buttons) { return; }

    resetNavButtonsOnDesktop(buttons, activeClass);
    buttons.forEach(btn => {
        const btnName = btn.getAttribute('data-nav-name');
        if (btnName == viewName) {
            btn.classList.add(activeClass);
            btn.setAttribute('data-active', 'true');
        }
    });
}

/**
 * Resets the active state of the navigation buttons on the desktop.
 * @param {Element[]} buttons
 * @param {string} activeClass
 */
function resetNavButtonsOnDesktop(buttons, activeClass) {
    buttons.forEach(btn => {
        btn.classList.remove(activeClass);
        btn.setAttribute('data-active', 'false');
    });
}

/**
 * Gets the navigation buttons within a specific container.
 * @param {string} containerClass
 * @returns {Element[] | null}
 */
function getNavButtons(containerClass) {
    const btnContainer = document.querySelector(containerClass);
    if (!btnContainer) { return null; }
    return btnContainer.querySelectorAll('button');
}