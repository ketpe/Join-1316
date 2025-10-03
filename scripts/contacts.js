let currentView = "";
const minDesktopHeight = 880;
const minDesktopWidth = 840;
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

async function onLoadSummary() {


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
        includeHtml("navbar", "navbarMobil.html"),
    ]);

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