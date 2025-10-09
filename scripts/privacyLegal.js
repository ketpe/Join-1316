let backToLoginPage = false;
let resizeLockPandL = false;



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

    setPrivacyOrLegalButtonActiv(pOrL, "desktop");
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

    setPrivacyOrLegalButtonActiv(pOrL, "mobile");
}

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

function clearPorLBody() {
    document.querySelector('body').innerHTML = "";
}

function backToSourcePage(){
    if(backToLoginPage){
        navigateToLogin();
    }else{
        history.back();
    }
}

