let currentSource = "";

async function onHelpLoad() {
    getCurrentSource();
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html")
    ]);
    hideHelpButton();
}

function getCurrentSource() {
    const param = new URLSearchParams(document.location.search);
    currentSource = param !== null ? param.get('source') : "";
}

function navigateBackToSource() {
    if(currentSource.length > 0){
        window.location.href = `./${currentSource}.html`;
    }
}

function hideHelpButton() {
    document.getElementById('help-button').classList.add('visually-hidden');
}