function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    splitName(signUp)
    checkPassword(signUp);
    let email = signUp.get("email");
    let acceptPolicy = document.getElementById("signup-confirm").checked;

    // Prüfe, ob alle Felder ausgefüllt sind
    if (!fullname || !email || !password || !confirmPassword || !acceptPolicy) {
        showErrorMessage("Please fill correct data in all fields.");
    }

    let { firstname, lastname } = splitName(fullname);
    checkPassword(password, confirmPassword, acceptPolicy, firstname, lastname, email);
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

