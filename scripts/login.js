function loginForm(event) {
    event.preventDefault();
    let signIn = new FormData(event.target);
    let email = signIn.get("email");
    let password = signIn.get("password");
    checkLogin(email, password);
};

async function checkLogin(email, password) {
    let logInUser = await getDataByKey("email", email, "contacts");
    if (logInUser && logInUser.password === password && logInUser.email === email) {
        logStatus(logInUser.id);
        navigateToSummary();

    } else {
        logStatus('0');
        location.reload();
    }
};

function loginGuest() {
    logStatus('0');
    navigateToSummary();
};
