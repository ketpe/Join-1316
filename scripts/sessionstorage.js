function setLogStatus(setLogStatus) {
    sessionStorage.setItem('logInStatus', setLogStatus);
};

function getLogStatus() {
    let logInStatus = sessionStorage.getItem('logInStatus');
    return logInStatus;
};

