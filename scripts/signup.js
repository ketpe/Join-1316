let errorMessageArr = [];
const namePattern = /\w{3,10}\s\w{3,10}/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


async function signupinit() {
    let logInStatus = getLogStatus();
    if (logInStatus !== "0") {
        navigateToLogin();
    }
    errorMessageArr = [];
}


function signInFieldOnBlur(input) {
    if (!input) { return; }

    if (input.id) {
        eval(`validate${input.id}()`);
    }
}


function validatefullname() {
    const nameElement = document.getElementById('fullname');
    if (!nameElement) { return; }
    const cleanNameValue = (nameElement.value ?? "").trim();
    if (cleanNameValue.length >= 3 && namePattern.test(cleanNameValue)) {
        setInputFieldHasNoError(nameElement.id);
        return true;
    } else {
        setInputFieldHasError(nameElement.id, "Please enter both - first and last name.");
        return false;
    }
}


async function validateemail() {
    const emailElement = document.getElementById('email');
    if (!emailElement) { return; }
    const cleanEmailValue = (emailElement.value ?? "").trim();
    if (cleanEmailValue.length >= 3 && emailPattern.test(cleanEmailValue) && !await checkEmailInDatabase(cleanEmailValue)) {
        setInputFieldHasNoError(emailElement.id);
        return true;
    } else if (await checkEmailInDatabase(cleanEmailValue)) {
        removeErrorMessageFromArray(emailElement.id);
        setInputFieldHasError(emailElement.id, "Email is already in use.");
        return false;
    } else {
        removeErrorMessageFromArray(emailElement.id);
        setInputFieldHasError(emailElement.id, "Incorrect email format.");
        return false;
    }
}


function validatepasswordConfirm() {
    const passwordElement = document.getElementById('password');
    const passwordConfirmElement = document.getElementById('passwordConfirm');
    if (!passwordElement || !passwordConfirmElement) { return; }

    if (passwordElement.value === passwordConfirmElement.value) {
        setInputFieldHasNoError(passwordConfirmElement.id);
        return true;
    }
    else {
        setInputFieldHasError(passwordConfirmElement.id, "Your passwords don't match. Please try again.");
        return false;
    }
}

function validatepassword() {
    const passwordElement = document.getElementById('password');
    if (!passwordElement) { return; }
    if (passwordElement.value.length <= 3) {
        setInputFieldHasError(passwordElement.id, "The password is too short.");
        return false;
    } else {
        setInputFieldHasNoError(passwordElement.id);
        return true;
    }
}

function setInputFieldHasNoError(elementID) {
    toggleBorderColorByError(elementID, true);
    removeErrorMessageFromArray(elementID);
    handleErrorMessage();
}

function setInputFieldHasError(elementID, message) {
    toggleBorderColorByError(elementID, false);
    addErrorMessageToArray(elementID, message);
}

function addErrorMessageToArray(elementID, message) {
    if (!errorMessageArr.some(x => x.field === elementID)) {
        errorMessageArr.push({ field: elementID, message });
    }
    handleErrorMessage();
}

function removeErrorMessageFromArray(elementID) {
    const errorMessageItem = errorMessageArr.find(x => x.field == elementID);
    if (!errorMessageItem) { return; }
    const itemIndex = errorMessageArr.indexOf(errorMessageItem);
    errorMessageArr.splice(itemIndex, 1);
}

function handleErrorMessage() {
    const errorElement = document.getElementById("login-error-text");
    errorElement.classList.remove("d-none");
    if (!errorElement) { return; }
    if (errorMessageArr.length == 0) {
        errorElement.textContent = "";
        errorElement.classList.add('d-none');
        return;
    }
    errorElement.textContent = errorMessageArr.length > 1 ? "Multiple fields contain errors. Please check." : errorMessageArr[0]['message'];
}


function validatePolicyAccept() {
    const confirmCheckbox = document.getElementById('signupConfirm');
    if (!confirmCheckbox) { return; }
    return confirmCheckbox.checked;
}

//TODO - Die Datenbankfunktion wieder freischalten!
async function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    if (!checkAllRequiredField()) { return; }
    const { firstname, lastname, initial } = splitNameToFirstLastAndInitial(signUp);
    const fb = new FirebaseDatabase();
    //if (!fb.createNewSignedUser(null, firstname, lastname, signUp.get('password'), signUp.get('email'), null, initial, null)) { return; }
    signInAfterSafe();
}

function splitNameToFirstLastAndInitial(signUp) {
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

async function checkEmailInDatabase(email) {
    let fb = new FirebaseDatabase();
    let found = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    return found ? true : false;
}

function signupMouseUp(event) {
    const button = document.getElementById('signup-button');
    if (!button) { return; }
    if (event.target == button) {
        leaveFocusOffAllFields();
        button.disabled = !(checkAllRequiredField());
    }
}

function leaveFocusOffAllFields() {
    const inputElemets = document.querySelectorAll("input");
    inputElemets.forEach((input) => {
        input.blur();
    });
}

function checkAllRequiredField() {
    const isNameVal = validatefullname();
    const isMailVal = validateemail();
    const isPwdVal = validatepassword();
    const isPwdConfirmVal = validatepasswordConfirm();
    const isPolicyConfirmVal = validatePolicyAccept();
    return isNameVal && isMailVal && isPwdVal && isPwdConfirmVal && isPolicyConfirmVal;
}

function signInAfterSafe() {
    const dialog = document.getElementById('signUp-safe-dialog');
    dialog.classList.remove('visually-hidden');
    dialog.classList.add('safe-dialog-show');
    dialog.showModal();
    setTimeout(function () {
        dialog.close();
        navigateToLogin();
    }, 1800);
}