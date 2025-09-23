function getContactListElement(contact, isAssinged, isdetailView = false, taskInstance){
    return `
        <button id="${contact['id']}" type="button" class="contact-list-btn ${(isAssinged ? 'contact-selected' : '')}" data-active="${(isAssinged ? 'true' : 'false')}" onclick="${taskInstance}.contactButtonOnListSelect(this)">
            <div class="contact-profil-container">
                <div class="contact-ellipse ${contact['initialColor']}"><span>${contact['initial']}</span></div>
                <p class="${(isAssinged ? 'white' : '')}" >${contact['firstname']} ${contact['lastname']}</p>
            </div>
            <div class="contact-check-icon ${(isAssinged ? 'contact-checked' : 'contact-unchecked')} ${isdetailView ? "d-none" : ""} " role="img" title="Check or uncheck Icon"></div>
        </button>
    `;
}

function getAssignedContactBadge(contact) {
    return `
        <div class="contact-ellipse ${contact['initialColor']}"><span>${contact['initial']}</span></div>
    `;
}

function getCategoryListElement(category, taskInstance) {
    return `
        <button type="button" id="${category['id']}" class="category-list-btn" onclick="${taskInstance}.categoryButtonOnListSelect(this)">
            <p>${category['title']}</p>
        </button>
    `;
}

function getSubtaskListElementReadOnly(subTask, taskInstance) {
    return `
        <li class="li-readonly" id="${subTask['id']}" ondblclick="${taskInstance}.editCurrentSelectedSubTask('${subTask['id']}')">
            <div class="subtask-list-input-container">
                <input class="sub-task-list-input-readonly" type="text" title="subtask list inputfield" value="${subTask['title']}" readonly>
                <div class="sub-list-edit-btn-container">
                    <button type="button" title="edit current entry button" onclick="${taskInstance}.editCurrentSelectedSubTask('${subTask['id']}')">
                        <div role="img" title="edit icon"></div>
                    </button>
                    <div></div>
                    <button type="button" title="delete current entry" onclick="${taskInstance}.deleteCurrentSelectedSubTask('${subTask['id']}')">
                        <div role="img" title="delete icon"></div>
                    </button>
                </div>
            </div>

        </li>
    `;
}

function getSubtaskListElementForChanging(subTask, taskInstance) {

    return `
        <li class="li-edit">
            <div class="subtask-list-input-container">
                <input id="subTaskEdit-${subTask['id']}" class="sub-task-list-input-edit" type="text" title="subtask list inputfield"
                    value="${subTask['title']}">
                <div class="sub-list-writing-btn-container">
                    <button type="button" title="delete current entry" onclick="${taskInstance}.deleteCurrentSelectedSubTask('${subTask['id']}')">
                        <div role="img" title="delete icon"></div>
                    </button>
                    <div></div>
                        <button type="button" title="accept current entry button" onclick="${taskInstance}.safeChangesOnCurrentSelectedSubtask('${subTask['id']}')">
                        <div role="img" title="accept icon"></div>
                    </button>
                </div>
            </div>
        </li>
    `;
    
}

function getSubtaskForDetailView(currentSubtask) {
    return `
        <div class="subtask-content">
            <button onclick="detailViewChangeSubtaskChecked(this)" type="button" data-id="${currentSubtask['id']}" data-checked="${currentSubtask['taskChecked']}"
                title="Check if the subtask is finished" class="checkbox-btn ${currentSubtask['taskChecked'] ? 'checkbox-btn-default-hover' : 'checkbox-btn-default'}"></button>
            <span id="subtask-text" class="subtask-text">${currentSubtask['title']}</span>
        </div>
    `;
}