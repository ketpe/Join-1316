function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    if (!checkName(signUp)) {
        return;
    }
    let { firstname, lastname, initials } = splitName(signUp);
    let password = checkPassword(signUp);
    if (!password) {
        return;
    }
    let email = signUp.get("email");
    let acceptPolicy = document.getElementById("signup-confirm").checked;
    if (!firstname || !lastname || !email || !password || !confirmPassword || !acceptPolicy) {
        showErrorMessage("Please fill correct data in all fields.");
        return;
    };
    let initialColor = getRandomColor();
    safeDataToDB(firstname, lastname, email, password, initials, initialColor)
}


function checkPassword(signUp) {
    let password = signUp.get("password");
    let confirmPassword = signUp.get("password-confirm");
    if (password === confirmPassword) {
        return { password, confirmPassword };
    } else {
        showErrorMessage("Your passwords don't match.");
        document.getElementById("contact-name").value = signUp.get("fullname");
        document.getElementById("username").value = signUp.get("email");
        return null;
    };
}

function splitName(signUp) {
    let fullName = signUp.get("fullname");
    let parts = fullName.trim().split(/\s+/); // trennt sauber bei beliebig vielen Leerzeichen

    let lastname = parts.pop();               // letztes Wort als Nachname
    let firstname = parts.join(" ");            // alles davor als ein Vorname wieder zusammensetzen
    let initialFirstname = firstname.charAt(0).toUpperCase();
    let initialLastname = lastname.charAt(0).toUpperCase();
    let initials = initialFirstname + initialLastname;

    return {
        firstname,
        lastname,
        initials
    };
}

async function safeDataToDB(firstname, lastname, email, password, initials, initialColor) {
    let uid = getNewUid();
    let data = {
        'id': uid,
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'password': password,
        'initial': initials,
        'initialColor': initialColor
    };
    const fb = new FirebaseDatabase();
    await fb.getFirebaseLogin(() => fb.putData(contacts, data));

}

