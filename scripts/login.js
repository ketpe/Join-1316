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

function togglePasswordVisibility(toggleCounter) {
    let passwordInput = document.getElementById("password");
    let toggleIcon = document.getElementById("loginTogglePassword");
    let togglePasswordVisibilityArray = {
        1: ["login-password-lock", "login-password-visible-off", 2, "password"],
        2: ["login-password-visible-off", "login-password-visible-on", 3, "text"],
        3: ["login-password-visible-on", "login-password-lock", 1, "password"],
    };
    if (togglePasswordVisibilityArray[toggleCounter]) {
        let [from, to, next, type] = togglePasswordVisibilityArray[toggleCounter];
        toggleIcon.classList.replace(from, to);
        passwordInput.type = type;
        toggleIcon.onclick = () => togglePasswordVisibility(next);
    };
}
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



