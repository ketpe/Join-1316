/**
 * @fileoverview
 * @namespace navigations
 * @description This script contains functions for navigating between different pages of the application.
 * It includes functions to navigate to the sign-up page, summary page, contact page, privacy policy,
 * legal notice page, and help page. It also includes functions to navigate to the add task page and board page,
 * as well as setting the active state of navigation buttons based on the current view.
 */
function navigateToSignUp() {
    window.location.href = './signup.html';
}

/**
 * @function navigateToSummary
 * @memberof navigations
 * @description Navigates to the summary page.
 * @param {HTMLElement} button
 * @param {boolean} isFromLogin
 * @returns {void}
 */
function navigateToSummary(button, isFromLogin=false) {

    if (button) {
        if (button.getAttribute('data-active') == "true") { return; }
    }

    window.location.href =  isFromLogin ? './summary.html?isNotStartup=true' : './summary.html';
}

/**
 * @function navigateToContact
 * @memberof navigations
 * @description Navigates to the contact page.
 * @param {HTMLElement} button
 * @returns {void}
 */
function navigateToContact(button) {
    if (button.getAttribute('data-active') == "true") { return; }
    window.location.href = './contacts.html';
}

/**
 * @function navigateToPrivacy
 * @memberof navigations
 * @description Navigates to the privacy policy page.
 * @param {Event} event
 * @param {string} login
 * @return {void}
 */
function navigateToPrivacy(event, login = "") {

    if (login == "login") {
        window.location.href = `./privacyPolicy.html?backToLogin=true`;
    } else {
        window.location.href = `./privacyPolicy.html?backToLogin=false`;
    }

}

/**
 * @function navigateToLegalNotice
 * @memberof navigations
 * @description Navigates to the legal notice page.
 * @param {Event} event
 * @param {string} loginOrSignin
 * @return {void}
 */
function navigateToLegalNotice(event, loginOrSignin = "") {

    if (loginOrSignin == "login" || loginOrSignin == "signin") {
        window.location.href = `./legalNotice.html?backToLogin=true`;
    } else {
        window.location.href = `./legalNotice.html?backToLogin=false`;
    }
}

/**
 * @function navigateToLogin
 * @memberof navigations
 * @description Navigates to the login page and sets the log status to '0'.
 * This function changes the current window location to the login page URL.
 * It also updates the log status in local storage to indicate that the user is logged out.
 * @returns {void}
 */
function navigateToLogin() {
    setLogStatus('0');
    window.location.href = './index.html?isNotStartup=true';
}

/**
 * @function navigateToHelp
 * @memberof navigations
 * @description Navigates to the help page.
 * @returns {void}
 */
function navigateToHelp() {
    window.location.href = './help.html';
}

/**
 * @function navigateToAddTask
 * @memberof navigations
 * @description Navigates to the add task page.
 * @param {HTMLElement} button
 * @returns {void}
 */
function navigateToAddTask(button, stateCategory="todo") {
    if (button) {
        if (button.getAttribute('data-active') == "true") { return; }
    }

    window.location.href = `./addTask.html?stateCategory=${stateCategory}`;
}

/**
 * @function navigateToBoard
 * @memberof navigations
 * @description Navigates to the board page.
 * @param {HTMLElement} button
 * @returns {void}
 */
function navigateToBoard(button) {
    if (button) {
        if (button.getAttribute('data-active') == "true") { return; }
    }

    window.location.href = './board.html';
}

/**
 * @function setNavigationButtonActive
 * @memberof navigations
 * @description Sets the active state of the navigation button based on the current view.
 * This function updates the button's appearance and state to reflect the active view.
 * @param {string} viewName
 * @param {string} desktopOrMobile
 * @returns {void}
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
 * @function resetNavButtonsOnDesktop
 * @memberof navigations
 * @description Resets the active state of the navigation buttons on the desktop.
 * @param {Element[]} buttons
 * @param {string} activeClass
 * @returns {void}
 */
function resetNavButtonsOnDesktop(buttons, activeClass) {
    buttons.forEach(btn => {
        btn.classList.remove(activeClass);
        btn.setAttribute('data-active', 'false');
    });
}

/**
 * @function getNavButtons
 * @memberof navigations
 * @description Gets the navigation buttons within a specific container.
 * @param {string} containerClass
 * @returns {Element[] | null}
 */
function getNavButtons(containerClass) {
    const btnContainer = document.querySelector(containerClass);
    if (!btnContainer) { return null; }
    return btnContainer.querySelectorAll('button');
}