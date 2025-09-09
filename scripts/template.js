function getContactListElement(contact, isAssinged){
    return `
        <button id="${contact['id']}" type="button" class="contact-list-btn ${(isAssinged ? 'contact-selected' : '')}" data-active="${(isAssinged ? 'true' : 'false')}" onclick="contactButtonOnListSelect(this)">
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

function getCategoryListElement(category) {
    return `
        <button type="button" id="${category['id']}" class="category-list-btn" onclick="categoryButtonOnListSelect(this)">
            <p>${category['title']}</p>
        </button>
    `;
}

function getSubtaskListElementReadOnly(subTask) {
    return `
        <li class="li-readonly" id="${subTask['id']}">
            <div class="subtask-list-input-container">
                <input class="sub-task-list-input-readonly" type="text" title="subtask list inputfield" value="${subTask['title']}" readonly>
                <div class="sub-list-edit-btn-container">
                    <button type="button" title="edit current entry button" onclick="editCurrentSelectedSubTask('${subTask['id']}')">
                        <div role="img" title="edit icon"></div>
                    </button>
                    <div></div>
                    <button type="button" title="delete current entry" onclick="deleteCurrentSelectedSubTask('${subTask['id']}')">
                        <div role="img" title="delete icon"></div>
                    </button>
                </div>
            </div>

        </li>
    `;
}

function getSubtaskListElementForChanging(subTask) {

    return `
        <li class="li-edit">
            <div class="subtask-list-input-container">
                <input id="subTaskEdit-${subTask['id']}" class="sub-task-list-input-edit" type="text" title="subtask list inputfield"
                    value="${subTask['title']}">
                <div class="sub-list-writing-btn-container">
                    <button type="button" title="delete current entry" onclick="deleteCurrentSelectedSubTask('${subTask['id']}')">
                        <div role="img" title="delete icon"></div>
                    </button>
                    <div></div>
                        <button type="button" title="accept current entry button" onclick="safeChangesOnCurrentSelectedSubtask('${subTask['id']}')">
                        <div role="img" title="accept icon"></div>
                    </button>
                </div>
            </div>
        </li>
    `;
    
}