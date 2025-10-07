let backToLoginPage = false;
let resizeLockPandL = false;
let sourcePage = "";



async function privacyOrLegalLoad(privacyOrLegal) {
    let param = new URLSearchParams(document.location.search);
    let pageParam = param.get('backToLogin');
    let sourceParam = param.get('source');

    backToLoginPage = pageParam != null && pageParam.startsWith("true");
    sourceParam != null && sourceParam.length > 0 ? sourcePage = sourceParam : sourcePage = "";
    const [height, width] = getCurrentWindowSize();

    if(width <= 880){
        await loadInMobileMode(privacyOrLegal);
    }else{
        await loadInDesktopMode(privacyOrLegal);
    }
    
}

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
}

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
            includeHtml("navbar", "navbarMobil.html")
        ]);
    }
}


function clearPorLBody() {
    document.querySelector('body').innerHTML = "";
}

function backToSourcePage(){
    if(sourcePage.length > 0){
        window.location.href = sourcePage;
    }
}

