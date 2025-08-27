function getContactListElement(contact, isAssinged){
    return `
        <button id="${contact['id']}" type="button" class="contact-list-btn ${(isAssinged ? 'contact-selected' : '')}" active="${(isAssinged ? 'true' : '')}" onclick="contactButtonOnListSelect(this)">
            <div class="contact-profil-container">
                <div class="contact-ellipse ${contact['initialColor']}"><span>${contact['initial']}</span></div>
                <p class="${(isAssinged ? 'white' : '')}" >${contact['firstname']} ${contact['lastname']}</p>
            </div>
            <div class="contact-check-icon  ${(isAssinged ? 'contact-checked' : 'contact-unchecked')}" role="img" title="Check or uncheck Icon"></div>
        </button>
    `;
}

function getAssignedContactBadge(contact) {
    return `
        <div class="contact-ellipse ${contact['initialColor']}"><span>${contact['initial']}</span></div>
    `;
}