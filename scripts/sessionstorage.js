function setLogStatus(setLogStatus) {
    sessionStorage.setItem('logInStatus', setLogStatus);
};

function getLogStatus() {
    let logInStatus = sessionStorage.getItem('logInStatus');
    if (!logInStatus) {
         window.location.href = './index.html';
        return;
    }
    return logInStatus;
};

