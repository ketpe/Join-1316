function navigateToSignUp() {
    window.location.href = './signup.html';
}

function navigateToSummary(button) {

    if(button){
         if(button.getAttribute('data-active') == "true"){return;}
    }
  
    window.location.href = './summary.html';
}

function navigateToContact(button) {
    if(button.getAttribute('data-active') == "true"){return;}
    window.location.href = './contactsDesktop.html';
}

function navigateToPrivacy(source = "") {

    if (source == "login") {
        window.location.href = './privacyPolicy.html?backToLogin=true';
    } else {
        window.location.href = './privacyPolicy.html';
    }

}

function navigateToLegalNotice(source) {
    if (source == "login" || source == "signin") {
        window.location.href = "./legalNotice.html?backToLogin=true";
    } else {
        window.location.href = "./legalNotice.html";
    }
}

function navigateToLogin() {
    setLogStatus('0');
    window.location.href = './index.html';
}

function navigateToHelp() {

    const currentURL = window.location.pathname;
    const currentPath = currentURL.substring(1, currentURL.length);
    const cuurentPathName = currentPath.split('.')[0];

    window.location.href = './help.html?source=' + cuurentPathName;
}

function navigateToAddTask(button) {
    if(button){
        if(button.getAttribute('data-active') == "true"){return;}
    }

    window.location.href = './addTask.html';
}

function navigateToBoard(button) {
    if(button.getAttribute('data-active') == "true"){return;}
    window.location.href = './boardDesktop.html';
}

function setNavigationButtonActive(viewName, desktopOrMobile){
    if(desktopOrMobile.length == 0 || viewName.length == 0){return;}
    const activeClass = desktopOrMobile == "desktop" ? 'nav-desktop-btn-active' : 'nav-mobile-btn-active';
    const btnContainer = desktopOrMobile == 'desktop' ? '.nav-desktop-menu' : '.nav-mobile-menu';

    const buttons = getNavButtons(btnContainer);
    if(!buttons){return;}

    resetNavButtonsOnDesktop(buttons, activeClass);
    buttons.forEach(btn => {
        const btnName = btn.getAttribute('data-nav-name');
        if(btnName == viewName){
            btn.classList.add(activeClass);
            btn.setAttribute('data-active', 'true');
        }
    });
}

function resetNavButtonsOnDesktop(buttons, activeClass) {
    buttons.forEach(btn => {
        btn.classList.remove(activeClass);
        btn.setAttribute('data-active', 'false');
    });
}

function getNavButtons(containerClass) {
    const btnContainer = document.querySelector(containerClass);
    if(!btnContainer){return null;}
    return btnContainer.querySelectorAll('button');
}