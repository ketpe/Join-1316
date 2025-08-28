function loginForm(event) {
    event.preventDefault();
    let signIn = new FormData(event.target);
    let email = signIn.get("email");
    let password = signIn.get("password");
    checkLogin(email, password);
};

function checkLogin(email, password) {
    let logInUser = getDataByKey("email", email, "contact");
    if (logInUser.password === password && logInUser.email === email) {
        sessionStorage.setItem('LogInStatus', JSON.stringify(id));
    } else {
        sessionStorage.setItem('LogInStatus', '0');
    }
    navigateToSummary();
};
