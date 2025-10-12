let currentSource = "";
let resizeLockHelp = false;

/**
 * Initializes the Help page on load.
 * Determines the appropriate layout based on the current window size.
 * @returns {Promise<void>}
 */
async function onHelpLoad() {
    getCurrentSource();
    const [height, width] = getCurrentWindowSize();

    if(width <= 880){
        await loadHelpInMobileMode();
    }else{
        await loadHelpInDesktopMode();
    }
   
}

/**
 * Resizes the Help dialog based on the current window size.
 * @returns {Promise<void>} 
 */
async function resizeHelp() {

    if(resizeLockHelp){return;}
    resizeLockHelp = true;

    const [height, width] = getCurrentWindowSize();
    if(width <= 880){
        await loadHelpInMobileMode();
    }else{
        await loadHelpInDesktopMode();
    }

    resizeLockHelp = false;
}

/**
 * Loads the Help content in desktop mode.
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
}

/**
 * Loads the Help content in mobile mode.
 * @returns {Promise<void>}
 */
async function loadHelpInMobileMode() {
    clearHelpBody();
    await includeHtmlForNode("body", "helpContentMobile.html");
    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html")
    ]);
}

/**
 * Clears the content of the Help page body.
 * This function removes all HTML content from the body element.
 */
function clearHelpBody() {
    document.querySelector('body').innerHTML = "";
}

/**
 * Retrieves the current source parameter from the URL.
 * This parameter is used to determine where to navigate back to.
 */
function getCurrentSource() {
    const param = new URLSearchParams(document.location.search);
    currentSource = param !== null ? param.get('source') : "";
}

/**
 * Navigates back to the source page.
 * Uses the browser's history to go back to the previous page.
 */
function navigateBackToSource() {
   history.back();
}

/**
 * Hides the Help button in the UI.
 * This is typically used when the Help page is already being viewed.
 */
function hideHelpButton() {
    document.getElementById('help-button').classList.add('visually-hidden');
}