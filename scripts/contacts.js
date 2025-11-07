/**
 * @namespace contacts
 * @description Contact list page functions and helpers.
 * Manages the loading and rendering of contacts in both mobile and desktop views.
 * Handles contact detail view toggling and action buttons.
 * Implements responsive design adjustments based on window size.
 */

let currentView = "";
const minDesktopHeight = 880;
const minDesktopWidth = 880;
const breakPointToDesktopSingle = 1180;

/**
 * @function onLoadContacts
 * @memberof contacts
 * @description Initializes the Contacts page on load.
 * Sets up the layout based on the current window size and renders the contact list.
 * @returns {Promise<void>}
 */
async function onLoadContacts() {
    checkUserOrGuestIsloggedIn();
    const [height, width] = getCurrentWindowSize();
    const head = document.getElementsByTagName('head');
    if (width >= minDesktopWidth) {
        await loadHtmlComponentsForDesktop();
    } else {
        await loadHtmlComponentsForMobile(head);
    }
    showLoadingAnimation();
    await renderContacts();
    hideLoadingAnimation();
    window.addEventListener('resize', addContactsPageResize);
    window.addEventListener('resize', updateLandscapeBlock);
}



/**
 * @function renderContacts
 * @memberof contacts
 * @description Renders the contact list by fetching sorted contacts from the Firebase database.
 * Populates the contact list in the UI with headers for each starting letter.
 * @returns {Promise<void>}
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
 * @function createContactList
 * @memberof contacts
 * @description Creates the contact list in the UI.
 * @param {string} currentLetter
 * @param {Array} sortedContacts
 * @param {HTMLElement} contactList
 *
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



/**
 * @function loadHtmlComponentsForDesktop
 * @memberof contacts
 * @description Loads the HTML components for the Contacts page in desktop mode.
 * Adjusts the layout and renders the contact list.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForDesktop() {
    currentView = "desktop";
    clearContactsHtmlBody();
    await includeHtmlForNode("body", "contactsDesktop.html");

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),

    ]);

    setNavigationButtonActive('contact', "desktop");
    showLoadingAnimation();
    await renderContacts();
    renderUserInitial();
    hideLoadingAnimation();
}

/**
 * @function loadHtmlComponentsForMobile
 * @memberof contacts
 * @description Loads the HTML components for the Contacts page in mobile mode.
 * Adjusts the layout and renders the contact list.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForMobile() {
    currentView = "mobile";
    clearContactsHtmlBody();
    await includeHtmlForNode("body", "contactsMobile.html");

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html"),
    ]);
    setNavigationButtonActive('contact', "mobile");
    showLoadingAnimation();
    await renderContacts();
    renderUserInitial();
    hideLoadingAnimation();
}

/**
 * @function clearContactsHtmlBody
 * @memberof contacts
 * @description Clears the body content of the Contacts page.
 * @returns {void}
 */
function clearContactsHtmlBody() {
    document.querySelector('body').innerHTML = "";
}



/**
 * @function addContactsPageResize
 * @memberof contacts
 * @description Adjusts the Contacts page layout on window resize.
 * @returns {Promise<void>}
 */
async function addContactsPageResize() {
    const [height, width] = getCurrentWindowSize();
    if ((width <= minDesktopWidth) && currentView != "mobile") {
        await loadHtmlComponentsForMobile();
        setNavigationButtonActive('contacts', "desktop");

    } else if (width >= minDesktopWidth + 1 && currentView != "desktop") {
        await loadHtmlComponentsForDesktop();
        setNavigationButtonActive('contacts', "mobile");
    }

}

/**
 * @function openContactDetail
 * @memberof contacts
 * @description Opens the contact detail view for the selected contact.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function openContactDetail(element) {
    const [height, width] = getCurrentWindowSize();
    toggleActiveContactClass(element);
    const fb = new FirebaseDatabase();
    const detailContact = await fb.getFirebaseLogin(() => fb.getDataByKey(key = "id", values = element.id, tableName = "contacts"));
    if ((width <= minDesktopWidth) && currentView == "mobile") {
        openContactDetailMobile(detailContact);
    } else if ((width >= minDesktopWidth + 1) && currentView == "desktop") {
        openContactDetailDesktop(detailContact);
    }
}

/**
 * @function toggleActiveContactClass
 * @memberof contacts
 * @description Toggles the active class for the selected contact.
 * @param {HTMLElement} activeContact
 * @returns {void}
 */
function toggleActiveContactClass(activeContact) {
    const contactItems = document.querySelectorAll('#contact-list .contact-item');
    contactItems.forEach(item => {
        item.classList.remove('contact-item-active');
    });
    if (activeContact) {
        activeContact.classList.add('contact-item-active');
    }
}

/**
 * @function clearActiveContactClass
 * @memberof contacts
 * @description Clears the active contact class and resets the contact list.
 * @return {void}
 */
function clearActiveContactClass() {
    const detailContact = document.getElementById('contact-detail-content');
    detailContact.innerHTML = "";
    renderContacts();
}

/**
 * @function onEditContactDialogOpen
 * @memberof contacts
 * @description Opens the edit contact dialog for the selected contact.
 * @param {string} id
 * @return {void}
 */
function onEditContactDialogOpen(id) {
    toggleScrollOnBody(true);
    addDialogShowClass();
    document.getElementById('add-contact-dialog').showModal();
    renderEditContactIntoDialog(id);
}

/**
 * @function openContactDetailMobile
 * @memberof contacts
 * @description Opens the contact detail view in mobile mode.
 * @param {Object} detailContact
 * @returns {void}
 */
function openContactDetailMobile(detailContact) {
    let renderDetailContact = document.getElementById('contact-detail-content');
    let contactListMobile = document.getElementById('contact-list-mobile');
    contactListMobile.classList.add('visually-hidden');
    renderDetailContact.parentElement.classList.remove('visually-hidden');
    renderDetailContact.innerHTML = "";
    renderDetailContact.innerHTML = getContactDetailView(detailContact, "-mobile");
    addNewActionBtns(detailContact);
}

/**
 * @function openContactDetailDesktop
 * @memberof contacts
 * @description Opens the contact detail view in desktop mode.
 * @param {Object} detailContact
 * @return {void}
 */
function openContactDetailDesktop(detailContact) {
    let renderDetailContact = document.getElementById('contact-detail-content');
    renderDetailContact.classList.remove('visually-hidden');
    document.body.classList.add('hide-scrollbar');
    renderDetailContact.innerHTML = "";
    renderDetailContact.classList.remove('slide-Details-in');
    renderDetailContact.offsetWidth;
    setTimeout(() => {
        document.body.classList.remove('hide-scrollbar');
    }, 800);
    renderDetailContact.classList.add('slide-Details-in');
    renderDetailContact.innerHTML += getContactDetailView(detailContact, "");
}

/**
 * @function addNewActionBtns
 * @memberof contacts
 * @description Adds new action buttons to the mobile contact detail view.
 * @param {Object} detailContact
 * @return {void}
 */
function addNewActionBtns(detailContact) {
    document.querySelector('.contacts-detailview-actions').classList.add('visually-hidden');
    document.getElementById('btn-add-contact-mobile').classList.add('visually-hidden');
    let refmobileBtn = document.querySelector('.contacts-main-mobile');
    let menuActionBtn = document.getElementById('btns-action-menu-mobile');
    menuActionBtn.innerHTML = "";
    menuActionBtn.innerHTML += getBtnsInMobileDetails(detailContact);
    refmobileBtn.innerHTML += getMobileBtnTemplate(detailContact);
}

/**
 * @function backToContactList
 * @memberof contacts
 * @description Navigates back to the contact list from the contact detail view in mobile mode.
 * @returns {void}
 */
function backToContactList() {
    let renderDetailContact = document.getElementById('contact-detail-content');
    let contactListMobile = document.getElementById('contact-list-mobile');
    contactListMobile.classList.remove('visually-hidden');
    renderDetailContact.parentElement.classList.add('visually-hidden');
    renderDetailContact.innerHTML = "";
    resetActionMenuMobile()
    renderContacts();

}

/**
 * @function openActionMenuMobile
 * @memberof contacts
 * @description Opens the action menu in the mobile contact detail view.
 * @returns {void}
 */
function openActionMenuMobile() {
    const actionMenu = document.querySelector('.detail-contact-actions-mobile');
    actionMenu.style.display = "flex";
    actionMenu.classList.toggle('visually-hidden');
    actionMenu.classList.remove('slide-Details-in');
    actionMenu.offsetWidth;
    actionMenu.classList.add('slide-Details-in');
}

/**
 * @function resetActionMenuMobile
 * @memberof contacts
 * @description Resets the action menu in the mobile contact detail view.
 * @return {void}
 */
function resetActionMenuMobile() {
    document.getElementById('btn-add-contact-mobile').classList.remove('visually-hidden');
    closeDialogByEvent(event, 'btns-action-menu-mobile');
    let refmobileBtn = document.querySelector('.contacts-main-mobile');
    let btnToRemove = refmobileBtn.querySelector('.mobile-menu-btn');
    if (btnToRemove) {
        btnToRemove.remove();
    }
}

