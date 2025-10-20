let errorMessageArr = [];
const namePattern = /\w{3,10}\s\w{3,10}/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Initialize the signup page.
 */
async function signupinit() {
    let logInStatus = getLogStatus();
    if (logInStatus !== "0") {
        navigateToLogin();
    }
    errorMessageArr = [];
}

/**
 * Handle onBlur event for sign-in fields.
 * @param {HTMLInputElement} input 
 * @returns 
 */
function signInFieldOnBlur(input) {
    if (!input) { return; }

    if (input.id) {
        eval(`validate${input.id}()`);
    }
}

/**
 * Validate the full name field.
 * @returns {Boolean}
 */
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

/**
 * Validate the email field.
 * @returns {Boolean}
 */
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

/**
 * Validate the password confirmation field.
 * @returns {Boolean}
 */
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

/**
 * Validate the password field.
 * @returns {Boolean}
 */
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

/**
 * Validate the policy acceptance checkbox.
 * @returns {Boolean}
 */
function validatePolicyAccept() {
    const confirmCheckbox = document.getElementById('signupConfirm');
    if (!confirmCheckbox) { return; }
    return confirmCheckbox.checked;
}

/**
 * Get first name, last name and initials from full name.
 * @param {*} signUp 
 * @returns 
 */
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

/**
 * Check if the email exists in the database.
 * @param {string} email 
 * @returns 
 */
async function checkEmailInDatabase(email) {
    let fb = new FirebaseDatabase();
    let found = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    return found ? true : false;
}

/**
 * Set the input field to a valid state (no error).
 * @param {String} elementID 
 */
function setInputFieldHasNoError(elementID) {
    toggleBorderColorByError(elementID, true);
    removeErrorMessageFromArray(elementID);
    handleErrorMessage();
}

/**
 * Set the input field to an invalid state (error).
 * @param {String} elementID 
 * @param {String} message 
 */
function setInputFieldHasError(elementID, message) {
    toggleBorderColorByError(elementID, false);
    addErrorMessageToArray(elementID, message);
}

/**
 * Add an error message for a specific element to the array.
 * @param {String} elementID 
 * @param {String} message 
 */
function addErrorMessageToArray(elementID, message) {
    if (!errorMessageArr.some(x => x.field === elementID)) {
        errorMessageArr.push({ field: elementID, message });
    }
    handleErrorMessage();
}

/**
 * Remove an error message for a specific element from the array.
 * @param {String} elementID 
 * @returns 
 */
function removeErrorMessageFromArray(elementID) {
    const errorMessageItem = errorMessageArr.find(x => x.field == elementID);
    if (!errorMessageItem) { return; }
    const itemIndex = errorMessageArr.indexOf(errorMessageItem);
    errorMessageArr.splice(itemIndex, 1);
}

/**
 * Handle error messages display.
 * @returns {void}
 */
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


//TODO - Die Datenbankfunktion wieder freischalten!
/**
 * Handle the sign-up form submission.
 * Safes the user data to the database and signs in the user.
 * @param {*} event 
 * @returns 
 */
async function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    if (!checkAllRequiredField()) { return; }
    const { firstname, lastname, initial } = splitNameToFirstLastAndInitial(signUp);
    const fb = new FirebaseDatabase();
    //if (!fb.createNewSignedUser(null, firstname, lastname, signUp.get('password'), signUp.get('email'), null, initial, null)) { return; }
    signInAfterSafe();
}

/**
 * Handle the mouse up event on the sign-up button.
 * @param {*} event 
 * @returns 
 */
function signupMouseUp(event) {
    const button = document.getElementById('signup-button');
    if (!button) { return; }
    if (event.target == button) {
        leaveFocusOffAllFields();
        button.disabled = !(checkAllRequiredField());
    }
}

/**
 * Remove focus from all input fields.
 */
function leaveFocusOffAllFields() {
    const inputElements = document.querySelectorAll("input");
    inputElements.forEach((input) => {
        input.blur();
    });
}

/**
 * Check all required fields for validity.
 * @returns {boolean}
 */
function checkAllRequiredField() {
    const isNameVal = validatefullname();
    const isMailVal = validateemail();
    const isPwdVal = validatepassword();
    const isPwdConfirmVal = validatepasswordConfirm();
    const isPolicyConfirmVal = validatePolicyAccept();
    return isNameVal && isMailVal && isPwdVal && isPwdConfirmVal && isPolicyConfirmVal;
}

/**
 * Show a dialog indicating successful sign-up and navigate to login page.
 */
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