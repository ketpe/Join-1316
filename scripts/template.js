function getContactListElement(contact){
    return `
        <button id="${contact['id']}" type="button" class="contact-list-btn" active="" onclick="contactButtonOnListSelect(this)">
            <div class="contact-profil-container">
                <div class="contact-ellipse ${contact['initialColor']}"><span>${contact['initial']}</span></div>
                <p>${contact['firstname']} ${contact['lastname']}</p>
            </div>
            <div class="contact-check-icon contact-unchecked" role="img" title="Check or uncheck Icon"></div>
        </button>
    `;
}