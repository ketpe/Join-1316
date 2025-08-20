/**
 * Renders the contact list
 * @returns
 */
async function renderContacts() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    let sortedContacts = await getSortedContact();
    let currentLetter = null;
    createContactList(currentLetter, sortedContacts, contactList)
}

/**
 * Creates the contact list
 * @param {*} currentLetter
 * @param {*} sortedContacts
 * @param {*} contactList
 */
function createContactList(currentLetter, sortedContacts, contactList) {
    for (const obj of sortedContacts) {
        let firstLetter = obj.firstname[0].toUpperCase();
        if (firstLetter !== currentLetter) {
            contactList.innerHTML += getContactListHeaderTemplate(firstLetter);
            contactList.innerHTML += getContactListContent(obj);
        } else {
            contactList.innerHTML += getContactListContent(obj);
        }
        currentLetter = firstLetter;
    }
}


