/**
 * @fileoverview
 * @namespace signup
 * @description This script manages the sign-up page functionality, including form validation,
 * user data handling, and navigation to the login page upon successful sign-up.
 * It includes functions to validate input fields, handle form submission,
 * and provide user feedback on errors.
 * @file scripts/signup.js
 */


const namePattern = /\w{3,10}\s\w{3,10}/;
let nameIsOnInput = false;
let emailIsOnInput = false;
let passwordIsOnInput = false;
let passwordConfirmIsOnInput = false;

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
 * @function signInFieldsOnInput
 * @memberof signup
 * @description Handle onInput event for sign-in fields.
 * @param {HTMLInputElement} input
 * @returns {void}
 */
function signInFieldsOnInput(input) {
    if (!input) { return; }
    hideErrorTextOfInputField(input.id);
}

/**
 * Hide the error text of the input field.
 * @function hideErrorTextOfInputField
 * @memberof signup
 * @description Hide the error text of the input field.
 * @param {string} inputFieldID
 * @returns {void}
 */
function hideErrorTextOfInputField(inputFieldID) {
    const errorTextElements = document.querySelectorAll('.login-signup-error-text-container p');
    if (!errorTextElements.length) { return; }
    const errorTextElement = Array.from(errorTextElements).find(x => x.getAttribute('data-input') == inputFieldID);
    if (!errorTextElement) { return; }
    errorTextElement.classList.add('d-none');
}

/**
 * @function validatefullname
 * @memberof signup
 * @description Validate the full name field.
 * @returns {Boolean}
 */
function validatefullname() {
    if (!nameIsOnInput) { return false; }
    const nameElement = document.getElementById('fullname');
    if (!nameElement) { return false; }
    const cleanNameValue = (nameElement.value ?? "").trim();
    if (cleanNameValue.length >= 55) {
        setInputFieldHasError(nameElement.id, "name-error-text", "Your Input is too long.");
        return false;
    } else if (cleanNameValue.length >= 3 && namePattern.test(cleanNameValue)) {
        setInputFieldHasNoError(nameElement.id, "name-error-text");
        return true;
    } else {
        setInputFieldHasError(nameElement.id, "name-error-text", "First and last name are required.");
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
    if (!emailIsOnInput) { return false; }
    const emailElement = document.getElementById('email');
    if (!emailElement) { return false; }
    const cleanEmailValue = (emailElement.value ?? "").trim();
    if (cleanEmailValue.length >= 3 && emailValidator(cleanEmailValue) && !await checkEmailInDatabase(cleanEmailValue)) {
        setInputFieldHasNoError(emailElement.id, "email-error-text");
        return true;
    } else if (await checkEmailInDatabase(cleanEmailValue)) {
        setInputFieldHasError(emailElement.id, "email-error-text", "Email is already in use.");
        return false;
    } else {
        setInputFieldHasError(emailElement.id, "email-error-text", "Not a valid email address.");
        return false;
    }
}

/**
 * @function validatepasswordConfirm
 * @memberof signup
 * @description Validate the password confirmation field.
 * @returns {Boolean}
 */
function validatepasswordConfirm() {
    if (!passwordIsOnInput || !passwordConfirmIsOnInput) { return false; }
    const passwordElement = document.getElementById('password');
    const passwordConfirmElement = document.getElementById('passwordConfirm');
    if (!passwordElement || !passwordConfirmElement) { return false; }
    if (passwordConfirmElement.value.length <= 3) {
        setInputFieldHasError(passwordConfirmElement.id, "login-confirm-error-text", "The password is too short.");
        return false;
    }
    else if (passwordElement.value === passwordConfirmElement.value) {
        setInputFieldHasNoError(passwordConfirmElement.id, "login-confirm-error-text");
        return true;
    }
    else if (!checkInputHasWhiteSpace(passwordConfirmElement.value)) {
        setInputFieldHasError(passwordConfirmElement.id, "login-confirm-error-text", "White spaces are not allowed.");
        return false;
    }
    else {
        setInputFieldHasError(passwordConfirmElement.id, "login-confirm-error-text", "Your passwords don't match. Please try again.");
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
    if (!passwordIsOnInput) { return false; }
    const passwordElement = document.getElementById('password');
    if (!passwordElement) { return false; }
    if (passwordElement.value.length <= 3) {
        setInputFieldHasError(passwordElement.id, "login-error-text", "The password is too short.");
        return false;
    }
    else if (!checkInputHasWhiteSpace(passwordElement.value)) {
        setInputFieldHasError(passwordElement.id, "login-error-text", "White spaces are not allowed.");
        return false;
    } else {
        setInputFieldHasNoError(passwordElement.id, "login-error-text");
        return true;
    }
}

function checkInputHasWhiteSpace(inputValue) {
    return inputValue.length == inputValue.replace(/\s+/g, "").length;
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
 * @function setInputFieldHasNoError
 * @memberof signup
 * @description Set the input field to a valid state (no error).
 * @param {String} elementID
 * @returns {void}
 */
function setInputFieldHasNoError(elementID, errorTextID) {
    toggleBorderColorByError(elementID, true);
    const errorElement = document.getElementById(errorTextID);
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.add("d-none");
    }
}

/**
 * @function setInputFieldHasError
 * @memberof signup
 * @description Set the input field to an invalid state (error).
 * @param {String} elementID
 * @param {String} message
 * @returns {void}
 */
function setInputFieldHasError(elementID, errorTextID, message) {
    toggleBorderColorByError(elementID, false);
    const errorElement = document.getElementById(errorTextID);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("d-none");
    }
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
    if (!await checkAllRequiredField()) { return; }
    const signUp = new FormData(event.target);
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
async function signupMouseUp(event) {
    const button = document.getElementById('signup-button');
    if (!button) { return; }
    if (event.target == button) {
        leaveFocusOffAllFields();
        button.disabled = !(await checkAllRequiredField());
        resetAllInputs();
    }
}

/**
 * @function resetAllInputs
 * @memberof signup
 * @description Reset all input field flags.
 * @return {void}
 */
function resetAllInputs() {
    nameIsOnInput = false;
    emailIsOnInput = false;
    passwordIsOnInput = false;
    passwordConfirmIsOnInput = false;
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
async function checkAllRequiredField() {
    const isNameVal = validatefullname();
    const isMailVal = await validateemail();
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