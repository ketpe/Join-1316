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
        sessionStorage.setItem('logInStatus', logInUser.id);
        navigateToSummary();

    } else {
        sessionStorage.setItem('logInStatus', '0');
        location.reload();
    }
};

function loginGuest() {
    sessionStorage.setItem('logInStatus', '0');
    navigateToSummary();
};
