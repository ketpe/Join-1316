function privacyOrLegalLoad() {
    let param = new URLSearchParams(document.location.search);
    let backToLoginPage = param.get('backToLogin');

    if(backToLoginPage !== null && backToLoginPage.startsWith("true")){
        includeHtml("navbar", "navbar-desktop-spezial.html");
    }else{
        includeHtml("navbar", "navbar-desktop.html");
    }
   
    includeHtml("header", "header-desktop.html");
    
}

