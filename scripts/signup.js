function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    let fullname = signUp.get("fullname");
    let email = signUp.get("email");
    let password = signUp.get("password");
    let confirmPassword = signUp.get("confirm-password");
    let acceptPolicy = document.getElementById("signup-confirm").checked;

    // Prüfe, ob alle Felder ausgefüllt sind
    if (!fullname || !email || !password || !confirmPassword || !acceptPolicy) {
        showSignupError("Please fill correct data in all fields.");
    }

    let { firstname, lastname } = splitName(fullname);
    checkPassword(password, confirmPassword, acceptPolicy, firstname, lastname, email);
}


function checkPassword(password, confirmPassword, acceptPolicy, firstname, lastname, email) {
    if (password === confirmPassword && acceptPolicy == true) {
        safeDataToDB(firstname, lastname, email, password);
        navigateToSummary()
    } else {
        showSignupError("Your passwords don't match.");
        window.reload();
    };
}

function splitName(fullName) {
    let parts = fullName.trim().split(/\s+/); // trennt sauber bei beliebig vielen Leerzeichen

    let lastname = parts.pop();               // letztes Wort
    let firstname = parts.join(" ");            // alles davor wieder zusammensetzen
    let initialFirstname = firstname.charAt(0).toUpperCase();
    let initialLastname = lastname.charAt(0).toUpperCase();
    let initials = initialFirstname + initialLastname;

    return {
        firstname,
        lastname,
        initials
    };
}

async function safeDataToDB(firstname, lastname, email, password, initials) {
    let uid = getNewUid();
    let data = {
        'id': uid,
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'password': password,
        'initial': initials
    };
    await putData(contacts, data);
}

function showSignupError(message) {
    let errorText = document.getElementById("login-error-text");
    errorText.textContent = message;
    errorText.classList.remove("d-none");
    setTimeout(() => errorText.classList.add("d-none"), 3000);
    window.reload();
}
