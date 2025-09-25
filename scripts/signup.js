async function signupinit() {
    let fb = new FirebaseDatabase();
    let data = await fb.getFirebaseLogin(() => fb.getAllData('contacts'));
    console.log("Daten empfangen:", data);
}



async function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    if (!checkName(signUp)) return;
    let { firstname, lastname, initial } = splitName(signUp);
    let email = await checkEmailTwice(signUp);
    if (!email) return;
    let password = checkPassword(signUp);
    if (!password) return;
    if (!document.getElementById("signupConfirm").checked) {
        showErrorMessage("Please accept the privacy policy.");
        return;
    }

    const fb = new FirebaseDatabase();
    if(!fb.createNewSignedUser(null, firstname, lastname, password.password, email, null, initial, null)){return;}
    //const result = await SafeDataToDB.safeDataToFirebaseDB(null, firstname, lastname, password, email, null, initial, null);
    toggleDNone('successfullySignUp');
}



function checkName(signUp) {
    let fullname = signUp.get("fullname")?.trim();
    let pattern = /^[A-Za-zÄÖÜäöüß]+(?:[ '-][A-Za-zÄÖÜäöüß]+)*$/;
    if (!fullname || !pattern.test(fullname)) {
        errorHandling("fullname", "Please enter a valid name.");
        return null;
    }
    if (fullname.split(/\s+/).length < 2) {
        errorHandling("fullname", "Please enter both - first and last name.");
        return null;
    }
    return true;
}

function splitName(signUp) {
    let fullName = signUp.get("fullname").trim();
    let parts = fullName.split(/\s+/);
    let lastname = parts.pop();
    let firstname = parts.join(" ");
    let cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    firstname = firstname.split(" ").map(cap).join(" ");
    lastname = cap(lastname);
    let initial = firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
    return { firstname, lastname, initial };
}

function checkPassword(signUp) {
    let pw = signUp.get("password");
    let pwc = signUp.get("password-confirm");
    if (pw === pwc) return { password: pw };
    errorHandling('loginTogglePasswordConfirm', "Your passwords don't match. Please try again.");
    document.getElementById("fullname").value = signUp.get("fullname");
    document.getElementById('email').value = signUp.get("email");
    return null;
}

async function checkEmailTwice(signUp) {
    let email = checkEmailWithFormValidation(signUp);
    if (!email) return null;
    return await checkEmailInDatabase(email);
}

function checkEmailWithFormValidation(signUp) {
    let email = signUp.get("email");
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (pattern.test(email)) return email;
    errorHandling('email', "Please enter a valid email address.");
    return null;
}

async function checkEmailInDatabase(email) {
    let fb = new FirebaseDatabase();
    let found = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    if (!found) return email;
    errorHandling('email', "This email is already registered. Please use another one.");
    return null;
}

function errorHandling(elementID = null, errorMessage) {
    showErrorMessage(errorMessage);
    toggleBorderColorByError(elementID);
    if (!elementID) document.getElementById(elementID).value = '';
    return;
}

function toggleSignUpButton() {
let checkFlag = document.getElementById('signup-hidden');
    if(checkFlag.disabled) {
        checkFlag.disabled = false;
      }
        else {
        checkFlag.disabled = true;
      }
    }