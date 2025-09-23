async function privacyOrLegalLoad() {
    let param = new URLSearchParams(document.location.search);
    let backToLoginPage = param.get('backToLogin');

    if (backToLoginPage !== null && backToLoginPage.startsWith("true")) {

        await Promise.all([
            includeHtml("navbar", "navbarDesktopSpezial.html"),
            includeHtml("header", "headerDesktop.html")
        ]);

    } else {
        await Promise.all([
            includeHtml("navbar", "navbarDesktop.html"),
            includeHtml("header", "headerDesktop.html")
        ]);
    }



}


