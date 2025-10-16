let currentView = "";
const minDesktopHeight = 880;
const minDesktopWidth = 880;
const breakPointToDesktopSingle = 1180;

/**
 * Renders the contact list
 * @returns
 */
async function renderContacts() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    const fb = new FirebaseDatabase();
    const sortedContacts = await fb.getFirebaseLogin(() => fb.getSortedContact());
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


async function onLoadContacts() {
    checkUserOrGuestIsloggedIn();
    const [height, width] = getCurrentContactSize();
    const head = document.getElementsByTagName('head');
    if (width >= minDesktopWidth) {
        await loadHtmlComponentsForDesktop(head);
        setNavigationButtonActive('contacts', "desktop");

    } else {
        await loadHtmlComponentsForMobile(head);
        setNavigationButtonActive('contacts', "mobile");
    }
    renderContacts()
}

async function loadHtmlComponentsForDesktop(head) {
    currentView = "desktop";
    clearContactsHtmlBody();
    await Promise.all([
        includeHtmlForNode("body", "contactsDesktop.html")
    ]);

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),

    ]);
    renderContacts();
}
/*REVIEW - möglichweise in script.js*/
function getCurrentContactSize() {
    return [height, width] = [window.innerHeight, window.innerWidth];
}

async function loadHtmlComponentsForMobile() {
    currentView = "mobile"
    clearContactsHtmlBody();

    await Promise.all([
        includeHtmlForNode("body", "contactsMobile.html")
    ]);

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html"),
    ]);
    renderContacts()
}

function clearContactsHtmlBody() {
    document.querySelector('body').innerHTML = "";
}

async function addContactsPageResize() {
    const [height, width] = getCurrentContactSize();
    if ((width <= minDesktopWidth) && currentView != "mobile") {
        await loadHtmlComponentsForMobile();
        setNavigationButtonActive('contacts', "desktop");

    } else if (width >= minDesktopWidth + 1 && currentView != "desktop") {
        await loadHtmlComponentsForDesktop();
        setNavigationButtonActive('contacts', "mobile");
    }

}

async function openContactDetail(element) {
    const listContactElement = element;
    const [height, width] = getCurrentContactSize();
    toggleActiveContactClass(listContactElement);
    const fb = new FirebaseDatabase();
    const detailContact = await fb.getFirebaseLogin(() => fb.getDataByKey(key = "id", values = listContactElement.id, tableName = "contacts"));
    if ((width <= minDesktopWidth) && currentView == "mobile") {
        openContactDetailMobile(detailContact);
    } else if ((width >= minDesktopWidth + 1) && currentView == "desktop") {
        openContactDetailDesktop(detailContact);
    }
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
    toggleScrollOnBody(true);
    addDialogShowClass();
    document.getElementById('add-contact-dialog').showModal();
    renderEditContactIntoDialog(id);
}

function openContactDetailMobile(detailContact) {
    let renderDetailContact = document.getElementById('contact-detail-content');
    let contactListMobile = document.getElementById('contact-list-mobile');
    contactListMobile.classList.add('visually-hidden');
    renderDetailContact.parentElement.classList.remove('visually-hidden');
    renderDetailContact.innerHTML = "";
    renderDetailContact.innerHTML = getContactDetailView(detailContact, "-mobile");
    addNewActionBtns(detailContact);
}
function openContactDetailDesktop(detailContact) {
    let renderDetailContact = document.getElementById('contact-detail-content');
    renderDetailContact.classList.remove('visually-hidden');
    renderDetailContact.innerHTML = "";
    renderDetailContact.classList.remove('slide-Details-in');
    renderDetailContact.offsetWidth;
    renderDetailContact.classList.add('slide-Details-in');
    renderDetailContact.innerHTML += getContactDetailView(detailContact, "");
}

function addNewActionBtns(detailContact) {
    document.querySelector('.contacts-detailview-actions').classList.add('visually-hidden');
    document.getElementById('btn-add-contact-mobile').classList.add('visually-hidden');
    let refmobileBtn = document.querySelector('.contacts-main-mobile');
    let menuActionBtn = document.getElementById('btns-action-menu-mobile');
    menuActionBtn.innerHTML = "";
    menuActionBtn.innerHTML += getBtnsInMobileDetails(detailContact);
    refmobileBtn.innerHTML += getMobileBtnTemplate(detailContact);
}

function backToContactList() {
    let renderDetailContact = document.getElementById('contact-detail-content');
    let contactListMobile = document.getElementById('contact-list-mobile');
    contactListMobile.classList.remove('visually-hidden');
    renderDetailContact.parentElement.classList.add('visually-hidden');
    renderDetailContact.innerHTML = "";
    resetActionMenuMobile()
    renderContacts();

}

function openActionMenuMobile() {
    const actionMenu = document.querySelector('.detail-contact-actions-mobile');
    actionMenu.style.display = "flex";
    actionMenu.classList.toggle('visually-hidden');
    actionMenu.classList.remove('slide-Details-in');
    actionMenu.offsetWidth;
    actionMenu.classList.add('slide-Details-in');
}

function resetActionMenuMobile() {
    document.getElementById('btn-add-contact-mobile').classList.remove('visually-hidden');
    closeDialogByEvent(event, 'btns-action-menu-mobile');
    let refmobileBtn = document.querySelector('.contacts-main-mobile');
    let btnToRemove = refmobileBtn.querySelector('.mobile-menu-btn');
    if (btnToRemove) {
        btnToRemove.remove();
    }
}