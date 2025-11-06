/**
 * @fileoverview
 * @namespace signup
 * @description This script manages the sign-up page functionality, including form validation,
 * user data handling, and navigation to the login page upon successful sign-up.
 * It includes functions to validate input fields, handle form submission,
 * and provide user feedback on errors.
 * @file scripts/signup.js
 */

let errorMessageArr = [];
const namePattern = /\w{3,10}\s\w{3,10}/;
const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * @function signupinit
 * @memberof signup
 * @description Initialize the signup page.
 * @returns {Promise<void>}
 */
async function signupinit() {
    let logInStatus = getLogStatus();
    if (logInStatus !== "0") {
        navigateToLogin();
    }
    errorMessageArr = [];

}

/**
 * @function signInFieldOnBlur
 * @memberof signup
 * @description Handle onBlur event for sign-in fields.
 * @param {HTMLInputElement} input
 * @returns {void}
 */
function signInFieldOnBlur(input) {
    if (!input) { return; }

    if (input.id) {
        eval(`validate${input.id}()`);
    }
}

/**
 * @function validatefullname
 * @memberof signup
 * @description Validate the full name field.
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
 * @function validateemail
 * @memberof signup
 * @description Validate the email field.
 * @returns {Boolean}
 */
async function validateemail() {
    const emailElement = document.getElementById('email');
    if (!emailElement) { return; }
    const cleanEmailValue = (emailElement.value ?? "").trim();
    if (cleanEmailValue.length >= 3 && emailValidator(cleanEmailValue) && !await checkEmailInDatabase(cleanEmailValue)) {
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
 * Checks if the provided email is valid according to RFC standards.
 * Validates length, format, and domain rules.
 * @function emailValidator
 * @memberof signup
 * @description Validate email format according to RFC standards.
 * @param {string} email
 * @returns {boolean}
 */
function emailValidator(email) {
    if (email.length > 254) { return false; }
    if (/\.{2,}/.test(email)) { return false; }
    if (!emailPattern.test(email)) { return false; }
    const [local, domain] = email.split('@');
    if (!local || !domain) return false;
    if (local.length > 64) return false;
    if (domain.startsWith('-') || domain.endsWith('-')) return false;
    if (domain.split('.').some(part => !part || part.length > 63)) return false;
    return true;
}

/**
 * @function validatepasswordConfirm
 * @memberof signup
 * @description Validate the password confirmation field.
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
 * @function validatepassword
 * @memberof signup
 * @description Validate the password field.
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
 * @function validatePolicyAccept
 * @memberof signup
 * @description Validate the policy acceptance checkbox.
 * @returns {Boolean}
 */
function validatePolicyAccept() {
    const confirmCheckbox = document.getElementById('signupConfirm');
    if (!confirmCheckbox) { return; }
    return confirmCheckbox.checked;
}

/**
 * @function splitNameToFirstLastAndInitial
 * @memberof signup
 * @description Get first name, last name and initials from full name.
 * @param {FormData} signUp - The form data from the sign-up form.
 * @returns {Object} - An object containing the first name, last name, and initials.
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
 * @function checkEmailInDatabase
 * @memberof signup
 * @description Check if the email exists in the database.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function checkEmailInDatabase(email) {
    let fb = new FirebaseDatabase();
    let found = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    return found ? true : false;
}

/**
 * @function setInputFieldHasNoError
 * @memberof signup
 * @description Set the input field to a valid state (no error).
 * @param {String} elementID
 * @returns {void}
 */
function setInputFieldHasNoError(elementID) {
    toggleBorderColorByError(elementID, true);
    removeErrorMessageFromArray(elementID);
    handleErrorMessage();
}

/**
 * @function setInputFieldHasError
 * @memberof signup
 * @description Set the input field to an invalid state (error).
 * @param {String} elementID
 * @param {String} message
 * @returns {void}
 */
function setInputFieldHasError(elementID, message) {
    toggleBorderColorByError(elementID, false);
    addErrorMessageToArray(elementID, message);
}

/**
 * @function addErrorMessageToArray
 * @memberof signup
 * @description Add an error message for a specific element to the array.
 * @param {String} elementID
 * @param {String} message
 * @returns {void}
 */
function addErrorMessageToArray(elementID, message) {
    if (!errorMessageArr.some(x => x.field === elementID)) {
        errorMessageArr.push({ field: elementID, message });
    }
    handleErrorMessage();
}

/**
 * @function removeErrorMessageFromArray
 * @memberof signup
 * @description Remove an error message for a specific element from the array.
 * @param {String} elementID
 * @returns {void}
 */
function removeErrorMessageFromArray(elementID) {
    const errorMessageItem = errorMessageArr.find(x => x.field == elementID);
    if (!errorMessageItem) { return; }
    const itemIndex = errorMessageArr.indexOf(errorMessageItem);
    errorMessageArr.splice(itemIndex, 1);
}

/**
 * @function handleErrorMessage
 * @memberof signup
 * @description Handle error messages display.
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



/**
 * @function signUpForm
 * @memberof signup
 * @description Handle the sign-up form submission.
 * Safes the user data to the database and signs in the user.
 * @param {Event} event
 * @returns {Promise<void>}
 */
async function signUpForm(event) {
    event.preventDefault();
    let signUp = new FormData(event.target);
    if (!checkAllRequiredField()) { return; }
    const { firstname, lastname, initial } = splitNameToFirstLastAndInitial(signUp);
    const fb = new FirebaseDatabase();
    if (!fb.createNewSignedUser(null, firstname, lastname, signUp.get('password'), signUp.get('email'), null, initial, null)) { return; }
    signInAfterSafe();
}

/**
 * @function signupMouseUp
 * @memberof signup
 * @description Handle the mouse up event on the sign-up button.
 * @param {MouseEvent} event
 * @returns {void}
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
 * @function leaveFocusOffAllFields
 * @memberof signup
 * @description Remove focus from all input fields.
 * @return {void}
 */
function leaveFocusOffAllFields() {
    const inputElements = document.querySelectorAll("input");
    inputElements.forEach((input) => {
        input.blur();
    });
}

/**
 * @function checkAllRequiredField
 * @memberof signup
 * @description Check all required fields for validity.
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
 * @function signInAfterSafe
 * @memberof signup
 * @description Show a dialog indicating successful sign-up and navigate to login page.
 * @return {void}
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