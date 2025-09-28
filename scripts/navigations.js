function navigateToSignUp() {
    window.location.href = './signup.html';
}

function navigateToSummary() {
    window.location.href = './summary.html';
}

function navigateToContact() {
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

function navigateToAddTask() {
    window.location.href = './addTask.html';
}

function navigateToBoard() {
    window.location.href = './boardDesktop.html';
}