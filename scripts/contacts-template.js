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
    return `<li class="contact-item">
                                        <div class="contact-initials">
                                            <p class="contact-initials-text">${obj.initial}</p>
                                        </div>
                                        <div class="contact-info">
                                            <div class="contact-name">${obj.firstname} ${obj.lastname}</div>
                                            <div class="contact-email">${obj.email}</div>
                                        </div>
                                    </li>`
}