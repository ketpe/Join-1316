function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    let lastname = signUp.get("lastname");
    let email = signUp.get("email");
    let password = signUp.get("password");
    let confirmPassword = signUp.get("confirm-password");
    let acceptPolicy = document.getElementById("signup-confirm").checked;
    checkPassword(password, confirmPassword, acceptPolicy, lastname, email);
};

function checkPassword(password, confirmPassword, acceptPolicy, lastname, email) {
    if (password === confirmPassword && acceptPolicy == true) {
        safeDataToDB(lastname, email, password);
        navigateToSummary()
    } else {
        toggleDNone("login-error-text", '')
        setTimeout(toggleDNone("login-error-text", ''), 3000);
        window.reload();
    };
};

async function safeDataToDB(lastname, email, password) {
    let uid = getNewUid();
    let data = {
        'id': uid,
        "lastname": lastname,
        "email": email,
        "password": password
    };
    await putData(contacts, data);
};
