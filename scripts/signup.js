async function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    if (!checkName(signUp)) return;
    let { firstname, lastname, initials } = splitName(signUp);
    let { password, confirmPassword } = checkPassword(signUp) || {};
    if (!password || !confirmPassword) return;
    let email = await checkEmailTwice(signUp);
    let acceptPolicy = document.getElementById("signup-confirm").checked;
    if (!firstname || !lastname || !email || !password || !confirmPassword || !acceptPolicy) {
        showErrorMessage("Please fill correct data in all fields.");
        return;
    }
    toggleDNone('successfullySignUp');
    await safeDataToDB(firstname, lastname, email, password, initials, getRandomColor());
}

function checkName(signUp) {
    let fullname = signUp.get("fullname")?.trim();
    let namePattern = /^[A-Za-zÄÖÜäöüß]+(?:[ '-][A-Za-zÄÖÜäöüß]+)*$/;
    if (!namePattern.test(fullname)) {
        showErrorMessage("Please enter a valid name.");
        document.getElementById("fullname").value = '';
        return null;
    }
    let parts = fullname.split(/\s+/);
    if (parts.length < 2) {
        showErrorMessage("Please enter both first name and last name.");
        document.getElementById("fullname").value = '';
        return null;
    }
    return true;
}

function checkPassword(signUp) {
    let password = signUp.get("password");
    let confirmPassword = signUp.get("password-confirm");
    if (password === confirmPassword) {
        console.log(password, confirmPassword)
        return { password, confirmPassword };
    }
    showErrorMessage("Your passwords don't match. Please try again.");
    toggleBorderColorByError('loginTogglePasswordConfirm');
    document.getElementById("fullname").value = signUp.get("fullname");
    document.getElementById("email").value = signUp.get("email");
    return null;
}

function splitName(signUp) {
    let fullName = signUp.get("fullname").trim();
    let parts = fullName.split(/\s+/);
    let lastname = parts.pop();
    let firstname = parts.join(" ");
    let capitalize = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    firstname = firstname.split(" ").map(capitalize).join(" ");
    lastname = capitalize(lastname);
    let initials = firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
    console.log(firstname, lastname, initials);
    return { firstname, lastname, initials };
}

async function checkEmailTwice(signUp) {
    let email = checkEmailWithFormValidation(signUp);
    if (!email) return null;
    console.log(email);
    email = await checkEmailInDatabase(signUp, email);
    return true;
}

function checkEmailWithFormValidation(signUp) {
    let email = signUp.get("email");
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) return email;
    showErrorMessage("Please enter a valid email address.");
    document.getElementById("email").value = '';
    return null;
}

async function checkEmailInDatabase(signUp, email) {
    let emailInDB = await getDataByKey("email", email, "contacts");
    if (!emailInDB) return email;
    showErrorMessage("This email address is already registered. Please use another email.");
    document.getElementById("email").value = '';
    return null;
}

async function safeDataToDB(firstname, lastname, email, password, initials, initialColor) {
    let uid = getNewUid();
    let data = { id: uid, firstname, lastname, email, password, initial: initials, initialColor };
    const fb = new FirebaseDatabase();
    await fb.getFirebaseLogin(() => fb.putData("contacts", data));
}
