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
        showErrorMessage('Check your email and password. Please try again.')
        location.reload();
    }
};

function loginGuest() {
    setLogStatus('0');
    navigateToSummary();
};

function togglePasswordVisibility() {
    let passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
};
