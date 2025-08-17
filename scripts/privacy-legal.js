async function privacyOrLegalLoad() {
    let param = new URLSearchParams(document.location.search);
    let backToLoginPage = param.get('backToLogin');

    if (backToLoginPage !== null && backToLoginPage.startsWith("true")) {

        await Promise.all([
            includeHtml("navbar", "navbar-desktop-spezial.html"),
            includeHtml("header", "header-desktop.html")
        ]);

    } else {
        await Promise.all([
            includeHtml("navbar", "navbar-desktop.html"),
            includeHtml("header", "header-desktop.html")
        ]);
    }



}


