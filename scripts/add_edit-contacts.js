async function newContact(event) {
    if (event) event.preventDefault(); // verhindert das Neuladen der Seite
    const uid = getNewUid();
    const contact = createContactObject(uid);
    var t = await putData(`/contacts/${uid}`, contact);
    console.log(uid);
    console.log(contact);
}

/*TODO - Kontakte selektieren bei Neuerstellung*/
/*TODO - Btn muss bei Fehler deaktiviert werden*/
/*TODO - Formular action übernehmen aus addTask*/

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

function getContactFormData() {
    const completeName = document.getElementById('contact-name').value;
    const [firstname, lastname] = completeName.split(" ");
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    return { firstname, lastname, email, phone };
}

function getInitials(firstname, lastname) {
    return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
}



async function editContact(event, button) {
    if (event) event.preventDefault();
    const contact = createUpdateContactObject();
    await updateData(`/contacts/${button.id}`, contact);
    closeDialogByEvent(event, 'add-contact-dialog');
    clearActiveContactClass();
    renderContacts();

}

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

async function onDeleteContact(event, element) {
    if (event) event.preventDefault();
    if (element.id !== "") {
        await deleteData(`/contacts/${element.id}`);
        clearActiveContactClass();
        addContactDialogClose(event);
        console.log(event);
        renderContacts();
    } else {
        console.warn("Keine gültige ID übergeben!");
    }
}

//REVIEW - Validierung der Kontaktdaten, könnte zusammengelegt werden mit Validierung in add-task

//NOTE - Generische Funktion zum Anzeigen / Ausblenden der Errormeldung
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

//NOTE - Generische Funktion zum Anzeigen / Ausblenden des Fehlerrahmens
function showAndLeaveErrorBorder(inputTarget, visibilty = true) {
    let inputField = document.getElementById(inputTarget);
    if (inputField == null) { return; }
    if (visibilty) {
        inputField.classList.add('input-has-error');
    } else {
        inputField.classList.remove('input-has-error');
    }
}
//NOTE - Validierung des Namensfeldes
function contactNameValidation(nameValue) {
    const cleanNameValue = (nameValue ?? "").trim();
    const namePattern = /\w{3,10}\s\w{3,10}/;

    if (cleanNameValue.length > 0 && namePattern.test(cleanNameValue)) {
        showAndLeaveErrorMessage("contact-name-required", false);
        showAndLeaveErrorBorder("contact-name", false);
    } else {
        showAndLeaveErrorMessage("contact-name-required", true);
        showAndLeaveErrorBorder("contact-name", true);
    }
}

//NOTE - Validierung des Emailfeldes
function contactEmailValidation(emailValue) {
    const cleanEmailValue = (emailValue ?? "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (cleanEmailValue.length > 0 && emailPattern.test(cleanEmailValue)) {
        showAndLeaveErrorMessage("contact-email-required", false);
        showAndLeaveErrorBorder("contact-email", false);
    } else {
        showAndLeaveErrorMessage("contact-email-required", true);
        showAndLeaveErrorBorder("contact-email", true);
    }
}

//NOTE - Validierung des Telefonfeldes
function contactPhoneValidation(phoneValue) {
    const cleanPhoneValue = (phoneValue ?? "").trim();
    const phonePattern = /^[\d\s\-+]{5,}$/;

    if (cleanPhoneValue.length > 0 && phonePattern.test(cleanPhoneValue)) {
        showAndLeaveErrorMessage("contact-phone-required", false);
        showAndLeaveErrorBorder("contact-phone", false);
    } else {
        showAndLeaveErrorMessage("contact-phone-required", true);
        showAndLeaveErrorBorder("contact-phone", true);
    }
}
//NOTE -  Funktion zum Rendern der Kontaktdaten im Edit-Dialog
function renderEditContactIntoDialog(id) {
    includeHtml("dialog-content-contacts", "edit-contact.html").then(() => {
        getDataByKey("id", id, "contacts").then(contact => {
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