function loginForm(event) {
    event.preventDefault();
    let signIn = new FormData(event.target);
    let email = signIn.get("email");
    let password = signIn.get("password");
    checkLogin(email, password);
};

async function checkLogin(email, password) {
    const fb = new FirebaseDatabase();
    const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    if (logInUser && logInUser.password === password && logInUser.email === email) {
        setLogStatus(logInUser.id);
        navigateToSummary();
    } else {
        setLogStatus('0');
        toggleBorderColorByError();
        showErrorMessage('Check your email and password. Please try again.')
    }
};

function loginGuest() {
    setLogStatus('0');
    navigateToSummary();
};

function toggleBorderColorByError() {
    let loginInputBorders = document.querySelectorAll(".login-signup-input, .loginErrorBorder");

    loginInputBorders.forEach(dataArray => {
        dataArray.classList.replace("login-signup-input", "loginErrorBorder");
    });
    setTimeout(() => {
        loginInputBorders.forEach(dataArray => {
            dataArray.classList.replace("loginErrorBorder", "login-signup-input");
        });
    }, 3000);
}



