async function openContactDetail(element) {
    const listContactElement = element;
    toggleActiveContactClass(listContactElement);
    let detailContact = await getDataByKey(key = "id", values = listContactElement.id, tableName = "contacts");
    let renderDetailContact = document.getElementById('contact-detail-content');
    renderDetailContact.innerHTML = "";
    renderDetailContact.classList.remove('slide-Details-in');
    void renderDetailContact.offsetWidth;
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

