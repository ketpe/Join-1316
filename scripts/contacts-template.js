/**
 * Creates the header template for a letter in the contact list
 * @param {string} firstLetter - The initial letter of the contacts
 * @returns {string} HTML template for the letter header
 */
function getContactListHeaderTemplate(firstLetter) {
    return `<li class="contact-letter">${firstLetter}</li>
                                    <li class="separator-contact-list"></li>`
};

/**
 * Creates the HTML template for a single contact
 * @param {Object} obj - The contact object
 * @param {string} obj.initial - The initials of the contact
 * @param {string} obj.firstname - The first name of the contact
 * @param {string} obj.lastname - The last name of the contact
 * @param {string} obj.email - The email address of the contact
 * @returns {string} HTML template for the contact
 */
function getContactListContent(obj) {
    return `<li class="contact-item" id="${obj.id}" onclick="openContactDetail('${obj.id}')">
                                        <div class="contact-initials">
                                            <p class="contact-initials-text">${obj.initial}</p>
                                        </div>
                                        <div class="contact-info">
                                            <div class="contact-name">${obj.firstname} ${obj.lastname}</div>
                                            <div class="contact-email">${obj.email}</div>
                                        </div>
                                    </li>`
}


function getContactDetailView(cd) {
    return `<div class="first-line-detail-view">
                                <div class="initial-avatar ${cd.initialColor}">
                                    <p class="detail-view-initials">${cd.initial}</p>
                                </div>
                                <div class="name-and-action-panel">
                                    <div class="contacts-detailview-name">${cd.firstname} ${cd.lastname}</div>
                                    <div class="contacts-detailview-actions">
                                        <button class="btn-contact-action btn-contact-edit">
                                            <div class="action-icons action-edit-icon"></div>
                                            <p>Edit</p>
                                        </button>
                                        <button class="btn-contact-action btn-contact-delete">
                                            <div class="action-icons action-delete-icon"></div>
                                            <p>Delete</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="detail-c-view-subline">
                                <p>Contact Information</p>
                            </div>
                            <div class="detail-c-view-information">
                                <div class="detail-c-view-email">
                                    <p>Email:</p>
                                    <p>anton.meier@example.com</p>
                                </div>
                                <div class="detail-c-view-phone">
                                    <p>Phone:</p>
                                    <p> +41 79 123 45 67</p>
                                </div>
                            </div>`
}