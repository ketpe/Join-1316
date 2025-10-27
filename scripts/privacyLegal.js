/**
 * @fileoverview
 * @namespace privacyLegal
 * @description Handles the loading and resizing of the Privacy Policy and Legal Notice pages.
 * Adjusts content based on window size for responsive design.
 * Manages navigation back to the source page.
 */

let backToLoginPage = false;
let resizeLockPandL = false;


/**
 * @function privacyOrLegalLoad
 * @memberof privacyLegal
 * @description Initializes the Privacy Policy or Legal Notice page on load.
 * @param {string} privacyOrLegal 
 * @returns {Promise<void>}
 */
async function privacyOrLegalLoad(privacyOrLegal) {
    let param = new URLSearchParams(document.location.search);
    let pageParam = param.get('backToLogin');

    backToLoginPage = pageParam != null && pageParam.startsWith("true");
    const [height, width] = getCurrentWindowSize();

    if(width <= 880){
        await loadInMobileMode(privacyOrLegal);
    }else{
        await loadInDesktopMode(privacyOrLegal);
    }
    window.addEventListener('resize', () => privacyOrLegalResize(privacyOrLegal));
}

/**
 * @function privacyOrLegalResize
 * @memberof privacyLegal
 * @description Handles window resize events to adjust the Privacy Policy or Legal Notice page layout.
 * Uses a lock to prevent multiple simultaneous executions.
 * @param {string} privacyOrLegal 
 * @returns {void}
 */
async function privacyOrLegalResize(privacyOrLegal){
    if(resizeLockPandL){return;}
    resizeLockPandL = true;

    const [height, width] = getCurrentWindowSize();
    if(width <= 880){
        await loadInMobileMode(privacyOrLegal);
    }else{
        await loadInDesktopMode(privacyOrLegal);
    }

    resizeLockPandL = false;
}

/**
 * @function loadInDesktopMode
 * @memberof privacyLegal
 * @description Loads the Privacy Policy or Legal Notice content in desktop mode.
 * @param {string} pOrL - The type of content to load ("privacy" or "legal")
 * @return {Promise<void>}
 */
async function loadInDesktopMode(pOrL) {
    const content = pOrL == "privacy" ? "privacyPolicyDesktopContent.html" : "legalNoticeDesktopContent.html";
    clearPorLBody();

    if(backToLoginPage){
        await includeHtmlForNode("body", content);
        await Promise.all([
            includeHtml("navbar", "navbarDesktopSpezial.html"),
            includeHtml("header", "headerDesktop.html")
        ]);
    }else{
        await includeHtmlForNode("body", content);
        await Promise.all([
            includeHtml("navbar", "navbarDesktop.html"),
            includeHtml("header", "headerDesktop.html")
        ]);
    }

    setPrivacyOrLegalButtonActiv(pOrL, "desktop");
}

/**
 * @function loadInMobileMode
 * @memberof privacyLegal
 * @description Loads the Privacy Policy or Legal Notice content in mobile mode.
 * @param {string} pOrL - The type of content to load ("privacy" or "legal")
 * @return {Promise<void>}
 */
async function loadInMobileMode(pOrL) {
    const content = pOrL == "privacy" ? "privacyPolicyMobileContent.html" : "legalNoticeMobileContent.html";
    clearPorLBody();

    if(backToLoginPage){
        await includeHtmlForNode("body", content);
        await Promise.all([
            includeHtml("header", "headerMobile.html"),
            includeHtml("navbar", "navbarMobilspezial.html")
        ]);
    }else{

        await includeHtmlForNode("body", content);
        await Promise.all([
            includeHtml("header", "headerMobile.html"),
            includeHtml("navbar", "navbarMobile.html")
        ]);
    }

    setPrivacyOrLegalButtonActiv(pOrL, "mobile");
}

/**
 * @function setPrivacyOrLegalButtonActiv
 * @memberof privacyLegal
 * @description Sets the active state of the compliance button based on the current view.
 * @param {string} pOrL - The type of content ("privacy" or "legal")
 * @param {string} desktopOrMobile - The current view ("desktop" or "mobile")
 * @returns {void}
 */
function setPrivacyOrLegalButtonActiv(pOrL, desktopOrMobile){
    const buttonClass = desktopOrMobile == "desktop" ? ".compliance-button" : '.nav-mobile-btn-compliance';
    const activeClass = desktopOrMobile == "desktop" ? "compliance-button-active" : "nav-mobile-btn-active";
    const buttons = document.querySelectorAll(buttonClass);
    if(!buttons){
        return;
    }

    buttons.forEach((btn) => {
        if(btn.getAttribute('data-target') == pOrL){
            btn.classList.add(activeClass);
            btn.setAttribute('disabled', 'true');
        }
    });
}

/**
 * @function clearPorLBody
 * @memberof privacyLegal
 * @description Clears the body content of the Privacy Policy or Legal Notice page.
 * @returns {void}
 */
function clearPorLBody() {
    document.querySelector('body').innerHTML = "";
}

/**
 * @function backToSourcePage
 * @memberof privacyLegal
 * @description Navigates back to the source page, either the login page or the previous page in history.
 * @returns {void}
 */
function backToSourcePage(){
    if(backToLoginPage){
        navigateToLogin();
    }else{
        history.back();
    }
}

