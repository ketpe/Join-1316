async function openContactDetail(element) {
    const listContactElement = element;
    toggleActiveContactClass(listContactElement);
    let detailContact = await getDataByKey(key = "id", values = listContactElement.id, tableName = "contacts");
    let renderDetailContact = document.getElementById('contact-detail-content');
    renderDetailContact.innerHTML = "";
    renderDetailContact.classList.remove('slide-Details-in'); // Animation zurücksetzen
    void renderDetailContact.offsetWidth; // Reflow erzwingen
    renderDetailContact.classList.add('slide-Details-in');
    renderDetailContact.innerHTML = getContactDetailView(detailContact);
}

function toggleActiveContactClass(activeContact) {
    const contactItems = document.querySelectorAll('#contact-list .contact-item');
    contactItems.forEach(item => {
        item.classList.remove('contact-item-active');
    });
    if (activeContact) {
        activeContact.classList.add('contact-item-active');
    }
}

function clearActiveContactClass() {
    const detailContact = document.getElementById('contact-detail-content');
    detailContact.innerHTML = "";
    renderContacts(); /*TODO - neue funktion zum zurücksetzen des Aktiven Kontakts*/
}

function onEditContactDialogOpen(id) {
    toggleScrollOnBody();
    addDialogShowClass();
    document.getElementById('add-contact-dialog').showModal();
    renderEditContactIntoDialog(id);
}

async function editContact(event, button) {
    if (event) event.preventDefault();
    const contact = createUpdateContactObject();
    await updateData(`/contacts/${button.id}`, contact);
    addContactDialogClose(event);
    renderContacts();

}

function createUpdateContactObject() {
    const { firstname, lastname, email, phone } = getContactFormData();
    return {
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'phone': phone,
        'initial': getInitials(firstname, lastname),
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
