let currentSource = "";

async function onHelpLoad() {
    getCurrentSource();
    await Promise.all([
        includeHtml("navbar", "navbar-desktop.html"),
        includeHtml("header", "header-desktop.html")
    ]);
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