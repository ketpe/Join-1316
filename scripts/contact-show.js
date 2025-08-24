async function openContactDetail(element) {
    const listContactElement = element;
    toggleActiveContactClass(listContactElement);
    let detailContact = await getDataByKey(key = "id", values = listContactElement.id, tableName = "contacts");
    let renderDetailContact = document.getElementById('contact-detail-content');
    renderDetailContact.innerHTML = "";
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
}