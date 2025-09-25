/**
 * @variable {boolean} validateName - Validate status for the name field
 * @variable {boolean} validateEmail - Validate status for the email field
 * @variable {boolean} validatePhone - Validate status for the phone field
 * @description - These variables are used to track the validation status of the contact form fields (name, email, phone).
 */
let validateName = false;
let validateEmail = false;
let validatePhone = false;

/**
 * @description - Create a new contact and save it to the database. After saving, it renders the updated contact list and selects the newly created contact.
 * @param {Event} event - The event object from the form submission.
 *
 */
async function newContact(event) {
    if (event) event.preventDefault();
    const uid = getNewUid();
    const contact = createContactObject(uid);
    const fb = new FirebaseDatabase();
    const data = await fb.getFirebaseLogin(() => fb.putData(`/contacts/${uid}`, contact));
    await renderContacts();
    selectNewContact(uid);
    validateName, validateEmail, validatePhone = false;
}

/**
 * @description - Select the newly created contact and open its details.
 * @param {string} uid - The unique identifier of the new contact.
 */
function selectNewContact(uid) {
    const newContactItem = document.getElementById(uid);
    openContactDetail(newContactItem);
    newContactItem.scrollIntoView();
}

/**
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
 * @description - Get the contact form data. This function retrieves the values from the contact form fields and splits the full name into first and last names.
 * @returns {Object} - An object containing the first name, last name, email, and phone number from the contact form.
 */
function getContactFormData() {
    const completeName = document.getElementById('contact-name').value;
    const [firstname, lastname] = completeName.split(" ");
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    return { firstname, lastname, email, phone };
}

/**
 * @description - Get the initials from the first and last name. This function takes the first character of the first name and the first character of the last name, converts them to uppercase, and concatenates them to form the initials.
 * @param {string} firstname - The first name of the contact.
 * @param {string} lastname - The last name of the contact.
 * @returns {string} - The initials of the contact.
 */
function getInitials(firstname, lastname) {
    return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
}

/**
 * @description - Edit an existing contact. This function gathers the updated contact data from the form and sends it to the database. After updating, it closes the dialog, clears the active contact class, and renders the updated contact list.
 * @param {Event} event - The event object from the form submission.
 */
async function editContact(event) {
    if (event) event.preventDefault();
    const buttonID = event.submitter.id;
    const contact = createUpdateContactObject();
    const fb = new FirebaseDatabase();
    const data = await fb.getFirebaseLogin(() => fb.updateData(`/contacts/${buttonID}`, contact));
    closeDialogByEvent(event, 'add-contact-dialog');
    clearActiveContactClass();
    renderContacts();

}
/**
 *
 * @returns {Object} - The updated contact object.
 * @description - Create an updated contact object. This function gathers the updated data from the contact form and constructs an object with the new values.
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
 * @description - Delete a contact. This function is triggered when the user confirms the deletion of a contact. It sends a request to the database to delete the contact and updates the UI accordingly.
 * @param {Event} event - The event object from the form submission.
 * @param {HTMLElement} element - The HTML element representing the contact to be deleted.
 */
async function onDeleteContact(event, element) {
    if (event) event.preventDefault();
    if (element.id !== "") {
        const fb = new FirebaseDatabase();
        const data = await fb.getFirebaseLogin(() => fb.deleteData(`/contacts/${element.id}`));
        clearActiveContactClass();
        addContactDialogClose(event);
        renderContacts();
    } else {
        console.warn("Keine gültige ID übergeben!");
    }
}

//REVIEW - Validierung der Kontaktdaten, könnte zusammengelegt werden mit Validierung in add-task

//NOTE - Generische Funktion zum Anzeigen / Ausblenden der Errormeldung

/**
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
 * @description - Validate the name field in the contact form. This function checks if the name field is filled out correctly and updates the validation status and error messages accordingly.
 */
function contactNameValidation() {
    let nameValue = document.getElementById('contact-name').value;
    const cleanNameValue = (nameValue ?? "").trim();
    const namePattern = /\w{3,10}\s\w{3,10}/;
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
 * @description - Validate the email field in the contact form. This function checks if the email field is filled out correctly and updates the validation status and error messages accordingly.
 *
 *  */
function contactEmailValidation() {
    let emailValue = document.getElementById('contact-email').value;
    const cleanEmailValue = (emailValue ?? "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (cleanEmailValue.length > 0 && emailPattern.test(cleanEmailValue)) {
        showAndLeaveErrorMessage("contact-email-required", false);
        showAndLeaveErrorBorder("contact-email", false);
        validateEmail = true;
    } else {
        showAndLeaveErrorMessage("contact-email-required", true);
        showAndLeaveErrorBorder("contact-email", true);
        validateEmail = false;
    }
}

/**
 * @description - Validate the phone field in the contact form. This function checks if the phone field is filled out correctly and updates the validation status and error messages accordingly.
 */
function contactPhoneValidation() {
    let phoneValue = document.getElementById('contact-phone').value;
    const cleanPhoneValue = (phoneValue ?? "").trim();
    const phonePattern = /^[\d\s\-+]{5,}$/;
    if (cleanPhoneValue.length > 0 && phonePattern.test(cleanPhoneValue)) {
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
 * @description - Toggle the state of the "Create Contact" button based on the validation status of the contact form fields. If all fields are valid, the button is enabled; otherwise, it is disabled.
 */
function toggleBtnCreateContact() {
    contactNameValidation();
    contactEmailValidation();
    contactPhoneValidation();
    const btn = document.getElementById('btn-create-contact');
    if (validateName && validateEmail && validatePhone) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}
/**
 * @description - Toggle the state of the "Edit Contact" button based on the validation status of the contact form fields. If all fields are valid, the button is enabled; otherwise, it is disabled.
 * @param {*} element
 */
function toggleBtnEditContact(element) {
    let btn = element;
    contactNameValidation();
    contactEmailValidation();
    contactPhoneValidation();
    if (validateName && validateEmail && validatePhone) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

/**
 * @description - Render the contact data into the edit dialog. This function fetches the contact data from the database using the provided ID and populates the edit contact dialog with the retrieved information.
 * @param {*} id
 */
function renderEditContactIntoDialog(id) {
    const fb = new FirebaseDatabase();
    includeHtml("dialog-content-contacts", "editContact.html").then(() => {
        fb.getDataByKey("id", id, "contacts").then(contact => {
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
 * @description - Cancel the addition of a new contact. This function resets the validation status of the contact form fields.
 * @param {*} event
 */
function cancelAddContact(event) {
    validateName, validateEmail, validatePhone = false;
}