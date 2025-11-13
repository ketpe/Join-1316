/**
 * @fileoverview
 * @namespace help
 * @description Manages the Help page functionality, including loading content based on window size
 * and navigating back to the source page.
 * Handles responsive design for mobile and desktop views.
 * Implements functions to load HTML content dynamically.
 * Manages the visibility of the Help button in the UI.
 */

let resizeLockHelp = false;
let currentViewHelp = "";

/**
 * @function onHelpLoad
 * @memberof help
 * @description Initializes the Help page on load.
 * Determines the appropriate layout based on the current window size.
 * @returns {Promise<void>}
 */
async function onHelpLoad() {
    const [height, width] = getCurrentWindowSize();

    if(width <= 880 && currentViewHelp !== MOBILE){
        await loadHelpInMobileMode();
    }else if(width > 880 && currentViewHelp !== DESKTOP){
        await loadHelpInDesktopMode();
    }
    window.addEventListener('resize', resizeHelp);
    window.addEventListener('resize', updateLandscapeBlock);
    await renderUserInitial();
}

/**
 * @function resizeHelp
 * @memberof help
 * @description Resizes the Help dialog based on the current window size.
 * @returns {Promise<void>} 
 */
async function resizeHelp() {

    if(resizeLockHelp){return;}
    resizeLockHelp = true;

    const [height, width] = getCurrentWindowSize();
    if(width <= 880 && currentViewHelp !== MOBILE){
        await loadHelpInMobileMode();
    }else if(width > 880 && currentViewHelp !== DESKTOP){
        await loadHelpInDesktopMode();
    }

    resizeLockHelp = false;
}

/**
 * @function loadHelpInDesktopMode
 * @memberof help
 * @description Loads the Help content in desktop mode.
 * @returns {Promise<void>}
 */
async function loadHelpInDesktopMode(){
    clearHelpBody();
    await includeHtmlForNode("body", "helpContentDesktop.html");
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html")
    ]);
    hideHelpButton();
    currentViewHelp = DESKTOP;
}

/**
 * @function loadHelpInMobileMode
 * @memberof help
 * @description Loads the Help content in mobile mode.
 * @returns {Promise<void>}
 */
async function loadHelpInMobileMode() {
    clearHelpBody();
    await includeHtmlForNode("body", "helpContentMobile.html");
    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html")
    ]);
    currentViewHelp = MOBILE;
}

/**
 * @function clearHelpBody
 * @memberof help
 * @description Clears the content of the Help page body.
 * This function removes all HTML content from the body element.
 * @returns {void}
 */
function clearHelpBody() {
    document.querySelector('body').innerHTML = "";
}


/**
 * @function navigateBackToSource
 * @memberof help
 * @description Navigates back to the source page.
 * Uses the browser's history to go back to the previous page.
 * @return {void}
 */
function navigateBackToSource() {
   history.back();
}

/**
 * @function hideHelpButton
 * @memberof help
 * @description Hides the Help button in the UI.
 * This is typically used when the Help page is already being viewed.
 * @return {void}
 */
function hideHelpButton() {
    document.getElementById('help-button').classList.add('visually-hidden');
}