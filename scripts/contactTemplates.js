/**
 * @namespace contactTemplates
 * @description Template functions for generating contact-related HTML elements.
 * Provides small template helpers used across the contact views.
 */

/**
 * @function getContactListHeaderTemplate
 * @memberof contactTemplates
 * Creates the header template for a letter in the contact list
 * @param {string} firstLetter - The initial letter of the contacts
 * @returns {string} HTML template for the letter header
 */
function getContactListHeaderTemplate(firstLetter) {
    return `<li onclick="clearActiveContactClass()" class="contact-letter">${firstLetter}</li>
<li class="separator-contact-list"></li>`
};

/**
 * @function getContactListContent
 * @memberof contactTemplates
 * Creates the HTML template for a single contact
 * @param {Object} obj - The contact object
 * @param {string} obj.initial - The initials of the contact
 * @param {string} obj.firstname - The first name of the contact
 * @param {string} obj.lastname - The last name of the contact
 * @param {string} obj.email - The email address of the contact
 * @returns {string} HTML template for the contact
 */
function getContactListContent(obj) {
    return `<li class="contact-item obj" id="${obj.id}" active="false" onclick="openContactDetail(this)">
    <div class="contact-initials ${obj.initialColor}">
        <p class="contact-initials-text">${obj.initial}</p>
    </div>
    <div class="contact-info">
        <div class="contact-name">${obj.firstname} ${obj.lastname}</div>
        <div class="contact-email">${obj.email}</div>
    </div>
</li>`
}

/**
 * @function getContactDetailView
 * @memberof contactTemplates
 * @description Creates the HTML template for the contact detail view.
 * @param {object} cd
 * @param {String} mobileSuffix
 * @returns {string} HTML template for the contact detail view
 */
function getContactDetailView(cd, mobileSuffix) {
    return `<div class="first-line-detail-view${mobileSuffix}">
    <div class="initial-avatar${mobileSuffix} ${cd.initialColor}">
        <p class="detail-view-initials${mobileSuffix}">${cd.initial}</p>
    </div>
    <div class="name-and-action-panel">
        <div class="contacts-detailview-name${mobileSuffix}">${cd.firstname} ${cd.lastname}</div>
        <div class="contacts-detailview-actions">
            <button type="button" onclick="openDialog('add-contact-dialog', ()  => renderEditContactIntoDialog('${cd.id}'))" class="btn-contact-action btn-contact-edit">
                <div class="action-icons action-edit-icon"></div>
                <p>Edit</p>
            </button>
            <button type="button" onclick="onDeleteContact(event,this)" data-id="${cd.id}" id="btn-contact-delete" class="btn-contact-action btn-contact-delete">
                <div class="action-icons action-delete-icon"></div>
                <p>Delete</p>
            </button>
        </div>
    </div>
    </div>
    <div class="detail-c-view-subline${mobileSuffix}">
        <p>Contact Information</p>
    </div>
    <div class="detail-c-view-information${mobileSuffix}">
        <div class="detail-c-view-email${mobileSuffix}">
            <p>Email:</p>
            <p>${cd.email}</p>
        </div>
        <div class="detail-c-view-phone${mobileSuffix}">
            <p>Phone:</p>
            <p>${cd.phone}</p>
        </div>
    </div>`
}

/**
 * @function getMobileBtnTemplate
 * @memberof contactTemplates
 * @param {object} cd
 * @returns {string} HTML template for the mobile button
 */
function getMobileBtnTemplate(cd) {
    return `<button onclick="openDialog('btns-action-menu-mobile')" type="button" class="mobile-menu-btn">
        &#x2022;&#x2022;&#x2022;
    </button>
    `
}

/**
 * @function getBtnsInMobileDetails
 * @memberof contactTemplates
 * @param {object} cd
 * @returns {string} HTML template for the mobile action buttons
 */
function getBtnsInMobileDetails(cd) {
    return `<button type="button"
                        onclick="openDialog('add-contact-dialog-mobile', ()  => renderEditContactIntoDialogMobile('${cd.id}'))"
                        class="btn-contact-action btn-contact-edit-mobile">
                        <div class="action-icons action-edit-icon"></div>
                        <p>Edit</p>
                    </button>
                    <button type="button" onclick="onDeleteContactMobile(event,this)" data-id="${cd.id}" id="btn-contact-delete"
                        class="btn-contact-action btn-contact-delete-mobile">
                        <div class="action-icons action-delete-icon"></div>
                        <p>Delete</p>
                    </button>`
}
