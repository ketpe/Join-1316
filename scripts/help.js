let currentSource = "";
let resizeLockHelp = false;

async function onHelpLoad() {
    getCurrentSource();
    const [height, width] = getCurrentWindowSize();

    if(width <= 880){
        await loadHelpInMobileMode();
    }else{
        await loadHelpInDesktopMode();
    }
   
}

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

async function loadHelpInDesktopMode(){
    clearHelpBody();
    await includeHtmlForNode("body", "helpContentDesktop.html");
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html")
    ]);
    hideHelpButton();
}

async function loadHelpInMobileMode() {
    clearHelpBody();
    await includeHtmlForNode("body", "helpContentMobile.html");
    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobil.html")
    ]);

    //hideHelpButton();
}

function clearHelpBody() {
    document.querySelector('body').innerHTML = "";
}

function getCurrentSource() {
    const param = new URLSearchParams(document.location.search);
    currentSource = param !== null ? param.get('source') : "";
}

function navigateBackToSource() {
   history.back();
}

function hideHelpButton() {
    document.getElementById('help-button').classList.add('visually-hidden');
}