function getContactListHeaderTemplate(firstLetter) {
    return `<li class="contact-letter">${firstLetter}</li>
                                    <li class="separator-contact-list"></li>`
};

function getContactListContent(obj) {
    return `<li class="contact-item">
                                        <div class="contact-initials">
                                            <p class="contact-initials-text">${obj.initial}</p>
                                        </div>
                                        <div class="contact-info">
                                            <div class="contact-name">${obj.firstname} ${obj.lastname}'</div>
                                            <div class="contact-email">${obj.email}</div>
                                        </div>
                                    </li>`
}