function navigateToSignUp() {
    window.location.href = './signup.html';
}

function navigateToSummary() {
    window.location.href = './summary-desktop.html';
}

function navigateToContact() {
    window.location.href = './contacts-desktop.html';
}

function navigateToPrivacy(source = "") {

    if (source == "login") {
        window.location.href = './privacy-policy.html?backToLogin=true';
    } else {
        window.location.href = './privacy-policy.html';
    }

}

function navigateToLegalNotice(source) {
    if (source == "login" || source == "signin") {
        window.location.href = "./legal-notice.html?backToLogin=true";
    } else {
        window.location.href = "./legal-notice.html";
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
    window.location.href = './add-task-desktop.html';
}

function navigateToBoard() {
    window.location.href = './board-desktop.html';
}