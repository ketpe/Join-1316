/**
 * @namespace addEditContacts
 * @description Edits and adds contacts to the Firebase database.
 *
 */

/**
 * @description Validation status for the name field.
 * @memberof addEditContacts
 * @type {boolean}
 */
let validateName = false;

/**
 * @description Validation status for the email field.
 * @memberof addEditContacts
 * @type {boolean}
 */
let validateEmail = false;

/**
 * @description Validation status for the phone field.
 * @memberof addEditContacts
 * @type {boolean}
 */
let validatePhone = false;

/**
 * @description List of contact-task connections for deletion purposes.
 * @memberof addEditContacts
 * @type {Array}
 */
let contactTaskConnectionList = [];

/**
 * @description Regular expression pattern for validating names (3-10 word characters for first and last name).
 * @memberof addEditContacts
 * @type {RegExp}
 **/
const namePattern = /^[A-Za-zÄÖÜäöüß]{2,}(?:\s[A-Za-zÄÖÜäöüß]{2,})+$/;

/**
 * @description Regular expression pattern for validating phone numbers (4-15 digits, optional leading +).
 * @memberof addEditContacts
 * @type {RegExp}
 **/
const phonePattern = /^(?:\+?\d{1,4})?(?:[ -]?\(?\d+\)?){1,6}$/;

/**
 * @description Indicates if the name input field is currently being edited.
 * @memberof addEditContacts
 * @type {boolean}
 */
let nameIsOnInput = false;
/**
 * @description Indicates if the name input field is currently being edited.
 * @memberof addEditContacts
 * @type {boolean}
 */
let emailIsOnInput = false;
/**
 * @description Indicates if the phone input field is currently being edited.
 * @memberof addEditContacts
 * @type {boolean}
 */
let phoneIsOnInput = false;

/**
 * @description Current contact email for validation purposes.
 * @memberof addEditContacts
 * @type {string}
 */
let currentContactEmail = "";

/**
 * @function newContact
 * @memberof addEditContacts
 * @description - Create a new contact and save it to the database. After saving, it renders the updated contact list and selects the newly created contact.
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>}
 */
async function newContact(event) {
    if (event) event.preventDefault();
    if (!validateAllFields()) return;
    const uid = getNewUid();
    const contact = createContactObject(uid);
    const fb = new FirebaseDatabase();
    const data = await fb.getFirebaseLogin(() => fb.putData(`/contacts/${uid}`, contact));
    showSavedToast('new');
    await renderContacts();
    selectNewContact(uid);
    validateName = validateEmail = validatePhone = false;
    closeDialogByEvent(event, 'add-contact-dialog');
}

/**
 * @function selectNewContact
 * @memberof addEditContacts
 * @description - Select the newly created contact and open its details.
 * @param {string} uid - The unique identifier of the new contact.
 * @return {void}
 */
function selectNewContact(uid) {
    const newContactItem = document.getElementById(uid);
    openContactDetail(newContactItem);
    newContactItem.scrollIntoView();
}

/**
 * @function createContactObject
 * @memberof addEditContacts
 * @description - Create a new contact object. This function gathers data from the contact form and constructs a contact object with a default password and random initial color.
 * @param {string} uid - The unique identifier of the new contact.
 * @returns {Object} - The new contact object.
 */
function createContactObject(uid) {
    const { firstname, lastname, email, phone } = getContactFormData();
    return {
        'id': uid,
        'firstname': firstname,
        'lastname': lastname,
        'password': '1234',
        'email': email,
        'phone': phone,
        'initial': getInitials(firstname, lastname),
        'initialColor': getRandomColor(),
    };
}

/**
 * @function splitName
 * @memberof addEditContacts
 * @description - Split the full name into first and last names. This function takes a full name string, trims it, and splits it into parts. The first part is considered the first name, and the last part is considered the last name. If only one part is present, it is returned as the first name, and the last name is set as an empty string.
 * @param {string} completeName - The full name of the contact.
 * @returns {Object} - An object containing the first name and last name.
 */
function splitName(completeName) {
    completeName = (completeName ?? '').trim().replace(/\s+/g, ' ');
    if (completeName.length === 0) return { firstname: '', lastname: '' };
    const parts = completeName.split(' ');
    if (parts.length === 1) return { firstname: parts[0], lastname: '' };
    const lastname = parts.pop();
    const firstname = parts.join(' ');
    return { firstname, lastname };
}

/**
 * @function getContactFormData
 * @memberof addEditContacts
 * @description - Get the contact form data. This function retrieves the values from the contact form fields and splits the full name into first and last names.
 * @returns {Object} - An object containing the first name, last name, email, and phone number from the contact form.
 */
function getContactFormData() {
    const completeName = document.getElementById('contact-name').value;
    const { firstname, lastname } = splitName(completeName);
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    return { firstname, lastname, email, phone };
}

/**
 * @function getInitials
 * @memberof addEditContacts
 * @description - Get the initials from the first and last name. This function takes the first character of the first name and the first character of the last name, converts them to uppercase, and concatenates them to form the initials.
 * @param {string} firstname - The first name of the contact.
 * @param {string} lastname - The last name of the contact.
 * @returns {string} - The initials of the contact.
 */
function getInitials(firstname, lastname) {
    const f = (firstname ?? '').trim();
    const l = (lastname ?? '').trim();
    const firstChar = f.length ? f.charAt(0).toUpperCase() : '';
    const lastChar = l.length ? l.charAt(0).toUpperCase() : '';
    return (firstChar + lastChar) || (f.charAt(0) || '').toUpperCase();
}


/**REVIEW - Zeile 193 hat gelegentlisch Konsolenfehler gemacht -> Vorschlag ID über den Query Selector aus Zeile 191 lesen */

/**
 * @function editContact
 * @memberof addEditContacts
 * @description - Edit an existing contact. This function gathers the updated contact data from the form and sends it to the database. After updating, it closes the dialog, clears the active contact class, and renders the updated contact list.
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>}
 */
async function editContact(event) {
    if (event) event.preventDefault();
    if (!validateAllFields()) return;

    const btn = document.querySelector('.login-form-buttons button');

    //const buttonID = event.target.childNodes[0].ownerDocument.activeElement.id;
    const contact = createUpdateContactObject();
    const fb = new FirebaseDatabase();
    const data = await fb.getFirebaseLogin(() => fb.updateData(`/contacts/${btn.id}`, contact));
    closeDialogByEvent(event, 'add-contact-dialog');
    clearActiveContactClass();
    renderContacts();
    showSavedToast('edit');
    resetAllVariables();
}


/**
 * @function contactSaveMouseUp
 * @memberof addEditContacts
 * @description Handle the mouse up event on the Save/Create button (Desktop & Mobile).
 * @param {MouseEvent} event
 * @returns {void}
 */
async function contactSaveMouseUp(event) {
    const desktopBtn = document.getElementById('btn-create-contact');
    const mobileBtn = document.querySelector('.btn-create.btn-fill.btn-md.btn-md-auto-height');
    if (event.target === desktopBtn || event.target === mobileBtn) {
        leaveFocusOffAllFields();
        let isValid = await checkValidation();
        if (desktopBtn) desktopBtn.disabled = !isValid;
        if (mobileBtn) mobileBtn.disabled = !isValid;
        //resetAllVariables();
    }
}

/**
 * @function leaveFocusOffAllFields
 * @memberof addEditContacts
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
 * @function editContactMobile
 * @memberof addEditContacts
 * @description - Edit an existing contact in mobile view. This function gathers the updated contact data from the form and sends it to the database. After updating, it closes the dialog and renders the updated contact list.
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>}
 */
async function editContactMobile(event) {
    if (event) event.preventDefault();
    if (!checkValidation()) return;
    const buttonID = event.target.childNodes[0].ownerDocument.activeElement.id;
    const contact = createUpdateContactObject();
    const fb = new FirebaseDatabase();
    const data = await fb.getFirebaseLogin(() => fb.updateData(`/contacts/${buttonID}`, contact));
    closeDialogByEvent(event, 'add-contact-dialog-mobile');
    const updatedContact = await fb.getDataByKey("id", buttonID, "contacts");
    if (typeof openContactDetailMobile === "function") {
        openContactDetailMobile(updatedContact);
    }
    resetAllVariables();
}

/**
 * @function createUpdateContactObject
 * @memberof addEditContacts
 * @returns {Object} - The updated contact object.
 * @description - Create an updated contact object. This function gathers the updated data from the contact form and constructs an object with the new values.
 * @returns {Object} - The updated contact object.
 */
function createUpdateContactObject() {
    const { firstname, lastname, email, phone } = getContactFormData();
    return {
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'phone': phone,
        'initial': getInitials(firstname, lastname)
    };
}

/**
 * @function onDeleteContact
 * @memberof addEditContacts
 * @description - Delete a contact. This function is triggered when the user confirms the deletion of a contact. It sends a request to the database to delete the contact and updates the UI accordingly.
 * @param {Event} event - The event object from the form submission.
 * @param {HTMLElement} element - The HTML element representing the contact to be deleted.
 * @returns {Promise<void>}
 */
async function onDeleteContact(event, element) {
    if (event) event.preventDefault();

    if (!element.id || element.id.length == 0) { return; }

    const result = await startDeleteOneContact(element.id);
    if (result) {
        clearActiveContactClass();
        renderContacts();
        showSavedToast('delete');
    }
}

/**
 * @function startDeleteOneContact
 * @memberof addEditContacts
 * @description - Start the deletion process for a contact.
 * This function checks for any task connections associated with the contact, removes those connections, and then deletes the contact from the database.
 * @param {string} contactID
 * @returns {Promise<boolean>}
 */
async function startDeleteOneContact(contactID) {
    if (! await readContactTaskConnection(contactID)) { return false; }
    if (! await removeContactTaskConnection()) { return false; }
    if (! await removeContact(contactID)) { return false; }
    return true;
}

/**
 * @function readContactTaskConnection
 * @memberof addEditContacts
 * @description - Read the task connections for a specific contact.
 * @param {string} contactID
 * @returns {Promise<boolean>}
 */
async function readContactTaskConnection(contactID) {
    const fb = new FirebaseDatabase();
    const contactConnection = await fb.getFirebaseLogin(() => fb.getAllData('taskContactAssigned'));
    const filterContact = contactConnection.filter(x => x['contactId'] == contactID);
    contactTaskConnectionList = filterContact;
    return filterContact != null;
}

/**
 * @function removeContactTaskConnection
 * @memberof addEditContacts
 * @description - Remove the task connections for a specific contact.
 * @returns {Promise<boolean>}
 */
async function removeContactTaskConnection() {
    const fb = new FirebaseDatabase();

    for (let i = 0; i < contactTaskConnectionList.length; i++) {
        try {
            await fb.getFirebaseLogin(() => fb.deleteData(`/taskContactAssigned/${contactTaskConnectionList[i].id}`));
        } catch (error) { return false; }
    }

    return true;
}

/**
 * @function removeContact
 * @memberof addEditContacts
 * @description - Remove a contact from the database.
 * @param {string} contactID
 * @returns {Promise<boolean>}
 */
async function removeContact(contactID) {
    try {
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.deleteData(`/contacts/${contactID}`));
        return true
    } catch (error) { return false; }
}


/**
 * @function showAndLeaveErrorMessage
 * @memberof addEditContacts
 * @description - Show or hide an error message. This function displays an error message for a specific form field by changing its visibility.
 * @param {string} messageTarget - The ID of the error message element.
 * @param {boolean} visibility - Whether to show or hide the error message.
 * @returns {void}
 */
function showAndLeaveErrorMessage(messageTarget, visibilty = true) {
    let errorField = document.getElementById(messageTarget);
    if (errorField == null) { return; }
    if (visibilty) {
        errorField.classList.remove("error-text-hidden");
        errorField.classList.add('error-text-show');
    } else {
        errorField.classList.add("error-text-hidden");
        errorField.classList.remove('error-text-show');
    }
}

/**
 * @function showAndLeaveErrorBorder
 * @memberof addEditContacts
 * @description - Show or hide an error border around an input field. This function adds or removes a CSS class to indicate an error state for a specific input field.
 * @param {string} inputTarget - The ID of the input field to show/hide the error border.
 * @param {boolean} visibility - Whether to show or hide the error border.
 * @returns {void}
 */
function showAndLeaveErrorBorder(inputTarget, visibilty = true) {
    let inputField = document.getElementById(inputTarget);
    if (inputField == null) { return; }
    visibilty ? inputField.classList.add('input-has-error') : inputField.classList.remove('input-has-error');
}

/**
 * @function contactNameValidation
 * @memberof addEditContacts
 * @description - Validate the name field in the contact form. This function checks if the name field is filled out correctly and updates the validation status and error messages accordingly.
 * @returns {void}
 */
function contactNameValidation() {
    let nameValue = document.getElementById('contact-name').value;
    const cleanNameValue = (nameValue ?? "").trim();
    if (cleanNameValue.length > 0 && namePattern.test(cleanNameValue)) {
        showAndLeaveErrorMessage("contact-name-required", false);
        showAndLeaveErrorBorder("contact-name", false);
        validateName = true;
    } else {
        showAndLeaveErrorMessage("contact-name-required", true);
        showAndLeaveErrorBorder("contact-name", true);
        validateName = false;
    }
}

/**
 * @function contactEmailValidation
 * @memberof addEditContacts
 * @description - Validate the email field in the contact form. This function checks if the email field is filled out correctly and updates the validation status and error messages accordingly.
 * @returns {void}
 */
async function contactEmailValidation() {
    let emailValue = document.getElementById('contact-email').value;
    const cleanEmailValue = (emailValue ?? "").trim();
    if (!currentContactEmail || cleanEmailValue !== currentContactEmail) {
        if (cleanEmailValue.length >= 3 && emailValidator(cleanEmailValue) && !await checkEmailInDatabase(cleanEmailValue)) {
            setConatctEmailIsOk();
        } else {
            setConatctEmailIsInvalid();
        }
    } else {
        setConatctEmailIsOk();
    }
}

/**
 * @function setConatctEmailIsOk
 * @memberof addEditContacts
 * @description - Set the contact email validation status to OK. This function updates the validation status and hides any error messages related to the email field.
 * @returns {void}
 */
function setConatctEmailIsOk() {
    showAndLeaveErrorMessage("contact-email-required", false);
    showAndLeaveErrorBorder("contact-email", false);
    validateEmail = true;
}

/**
 * @function setConatctEmailIsInvalid
 * @memberof addEditContacts
 * @description - Set the contact email validation status to invalid. This function updates the validation status and shows error messages related to the email field.
 * @returns {void}
 */
function setConatctEmailIsInvalid() {
    showAndLeaveErrorMessage("contact-email-required", true);
    showAndLeaveErrorBorder("contact-email", true);
    validateEmail = false;
}

/**
 * @function checkEmailInDatabase
 * @memberof addEditContacts
 * @description - Check if the email already exists in the database. This function queries the database to see if the provided email is already associated with an existing contact.
 */
function resetAllVariables() {
    validateName = false;
    validateEmail = false;
    validatePhone = false;
    nameIsOnInput = false;
    emailIsOnInput = false;
    phoneIsOnInput = false;
}

/**
 * @function contactPhoneValidation
 * @memberof addEditContacts
 * @description - Validate the phone field in the contact form. This function checks if the phone field is filled out correctly and updates the validation status and error messages accordingly.
 * @returns {void}
 */
function contactPhoneValidation() {
    let phoneValue = document.getElementById('contact-phone');
    let cleanPhoneValue = (phoneValue.value ?? "").trim();
    cleanPhoneValue = cleanPhoneValue.replace(/\D/g, "");
    phoneValue.value = cleanPhoneValue;
    if (cleanPhoneValue.length >= 7 && cleanPhoneValue.length < 15 && phonePattern.test(cleanPhoneValue)) {
        showAndLeaveErrorMessage("contact-phone-required", false);
        showAndLeaveErrorBorder("contact-phone", false);
        validatePhone = true;
    } else {
        showAndLeaveErrorMessage("contact-phone-required", true);
        showAndLeaveErrorBorder("contact-phone", true);
        validatePhone = false;
    }
}

/**
 * @function checkValidation
 * @memberof addEditContacts
 * @description - Check the validation status of all contact form fields. This function validates each field based on whether it has been modified and returns the overall validation status.
 * @returns {boolean}
 */
async function checkValidation() {
    let { cVName, cVEmail, cVPhone } = getfieldCheckVariables();
    if (nameIsOnInput) {
        contactNameValidation();
        cVName = currentContactEmail === "" ? validateName : !!validateName;
    }
    if (emailIsOnInput) {
        await contactEmailValidation();
        cVEmail = currentContactEmail === "" ? validateEmail : !!validateEmail;
    }
    if (phoneIsOnInput) {
        contactPhoneValidation();
        cVPhone = currentContactEmail === "" ? validatePhone : !!validatePhone;
    }
    return cVName && cVEmail && cVPhone && currentContactEmail !== "";
}

/**
 * @function getfieldCheckVariables
 * @memberof addEditContacts
 * @description - Get the field check variables for validation. This function determines whether each field should be validated based on the current contact email state.
 * @returns
 */
function getfieldCheckVariables() {
    let cVName = currentContactEmail === "" ? false : true;
    let cVEmail = currentContactEmail === "" ? false : true;
    let cVPhone = currentContactEmail === "" ? false : true;
    return { cVName, cVEmail, cVPhone };
}

/**
 * @function validateAllFields
 * @memberof addEditContacts
 * @description - Validate all contact form fields. This function checks the validation status of each field and returns true if all fields are valid.
 * @returns
 */
async function validateAllFields() {
    return validateName && validateEmail && validatePhone;
}

/**
 * @function clearErrorMessagesOnInput
 * @memberof addEditContacts
 * @description - Clear error messages for the specified input field. This function is called on input events to remove error messages and styles when the user starts typing.
 * @param {*} inputId - The ID of the input field to clear error messages for.
 */
function clearErrorMessagesOnInput(inputId) {
    if (inputId === 'contact-name') {
        showAndLeaveErrorMessage("contact-name-required", false);
        showAndLeaveErrorBorder("contact-name", false);
    }
    if (inputId === 'contact-email') {
        showAndLeaveErrorMessage("contact-email-required", false);
        showAndLeaveErrorBorder("contact-email", false);
    }
    if (inputId === 'contact-phone') {
        showAndLeaveErrorMessage("contact-phone-required", false);
        showAndLeaveErrorBorder("contact-phone", false);
    }
}
/**
 * @function renderEditContactIntoDialog
 * @memberof addEditContacts
 * @description - Render the contact data into the edit dialog. This function fetches the contact data from the database using the provided ID and populates the edit contact dialog with the retrieved information.
 * @param {string} id - The ID of the contact to edit.
 * @return {void}
 */
function renderEditContactIntoDialog(id) {
    const fb = new FirebaseDatabase();
    includeHtml("add-contact-dialog", "editContact.html").then(() => {
        fb.getDataByKey("id", id, "contacts").then(contact => {
            currentContactEmail = contact.email;
            document.getElementById('contact-name').value = `${contact.firstname} ${contact.lastname}`;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-phone').value = contact.phone;
            document.getElementById('initial-avatar').classList.add(contact.initialColor);
            document.querySelector('#initial-avatar .detail-view-initials').innerText = contact.initial;
            document.querySelector('.btn-create').id = contact.id;
            document.querySelector('.btn-clear-cancel').id = contact.id;
        });
    });
}

/**
 * @function renderEditContactIntoDialogMobile
 * @memberof addEditContacts
 * @description - Render the contact data into the edit dialog for mobile view. This function fetches the contact data from the database using the provided ID and populates the edit contact dialog with the retrieved information.
 * @param {string} id - The ID of the contact to edit.
 * @return {void}
 */
function renderEditContactIntoDialogMobile(id) {
    closeDialog('btns-action-menu-mobile');
    const fb = new FirebaseDatabase();
    includeHtml("add-contact-dialog-mobile", "editContactMobile.html").then(() => {
        fb.getDataByKey("id", id, "contacts").then(contact => {
            document.getElementById('contact-name').value = `${contact.firstname} ${contact.lastname}`;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-phone').value = contact.phone;
            document.getElementById('initial-avatar').classList.add(contact.initialColor);
            document.querySelector('#initial-avatar .detail-view-initials').innerText = contact.initial;
            document.querySelector('.btn-create').id = contact.id;
            document.querySelector('.btn-clear-cancel-mobile').id = contact.id;
        });
    });
}

/**
 * @function cancelAddContact
 * @memberof addEditContacts
 * @description - Cancel the addition of a new contact. This function resets the validation status of the contact form fields.
 * @param {Event} event - The event object.
 * @return {void}
 */
function cancelAddContact(event) {
    validateName = false;
    validateEmail = false;
    validatePhone = false;
    closeDialog('add-contact-dialog');
}

/**
 * @function onDeleteContactMobile
 * @memberof addEditContacts
 * @description - Handle the deletion of a contact in mobile view.
 * @param {Event} event - The event object.
 * @param {HTMLElement} element - The "Delete Contact" button element.
 * @returns {void}
 */
function onDeleteContactMobile(event, element) {
    onDeleteContact(event, element);
    backToContactList();
    const dialog = document.getElementById('btns-action-menu-mobile');
    if (dialog && dialog.open) dialog.close();
}

/**
 * @function showSavedToast
 * @memberof addEditContacts
 * @description - Show a toast notification indicating that changes have been saved. This function displays a toast message based on the type of action performed (edit, new, delete) and automatically hides it after a short duration.
 * @param {*} actionType
 * @returns {Promise<void>}
 */
async function showSavedToast(actionType) {
    const toast = document.getElementById('addContactSafeChangesToast');
    if (!toast) { return; }
    const span = toast.querySelector('span');
    span.innerText = actionType === 'edit' ? 'Changes saved!' : actionType === 'new' ? 'New Contact created!' : actionType === 'delete' ? 'Contact deleted!' : '';
    toast.style.display = 'flex';
    toast.classList.add('safe-changes-toast-open');
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.classList.remove('safe-changes-toast-open');
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.style.display = 'none';
}

