/**
 * @namespace addTaskTemplate
 * @description Template functions for generating AddTask HTML elements.
 * Provides reusable HTML snippets for contact lists, category lists, and subtask lists.
 * These functions facilitate the dynamic creation of UI components in the task management application.
 */

/**
 * Generates the HTML for a contact list element.
 * @function getContactListElement
 * @memberof addTaskTemplate
 * @param {Object} contact - The contact information.
 * @param {boolean} isAssinged - Indicates if the contact is assigned.
 * @param {boolean} isdetailView - Indicates if the detail view is active.
 * @param {Object} taskInstance - The task instance.
 * @returns {string} The HTML string for the contact list element.
 */

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

/**
 * Generates the HTML for an assigned contact badge.
 * @function getAssignedContactBadge
 * @memberof addTaskTemplate
 * @param {Object} contact - The contact information.
 * @returns {string} The HTML string for the assigned contact badge.
 */
function getAssignedContactBadge(contact) {
    return `
        <div class="contact-ellipse ${contact['initialColor']}"><span>${contact['initial']}</span></div>
    `;
}

/**
 * Generates the HTML for a category list element.
 * @function getCategoryListElement
 * @memberof addTaskTemplate
 * @param {Object} category - The category information.
 * @param {Object} taskInstance - The task instance.
 * @returns {string} The HTML string for the category list element.
 */
function getCategoryListElement(category, taskInstance) {
    return `
        <button type="button" id="${category['id']}" class="category-list-btn" onclick="${taskInstance}.categoryButtonOnListSelect(this)">
            <p>${category['title']}</p>
        </button>
    `;
}

/**
 * Generates the HTML for a read-only subtask list element.
 * @function getSubtaskListElementReadOnly
 * @memberof addTaskTemplate
 * @param {Object} subTask - The subtask information.
 * @param {Object} taskInstance - The task instance.
 * @returns {string} The HTML string for the read-only subtask list element.
 */
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

/**
 * Generates the HTML for a subtask list element in edit mode.
 * @function getSubtaskListElementForChanging
 * @memberof addTaskTemplate
 * @param {Object} subTask - The subtask information.
 * @param {Object} taskInstance - The task instance.
 * @returns {string} The HTML string for the subtask list element in edit mode.
 */
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

/**
 * Generates the HTML for a subtask detail view.
 * @function getSubtaskForDetailView
 * @memberof addTaskTemplate
 * @param {Object} currentSubtask - The current subtask information.
 * @returns {string} The HTML string for the subtask detail view.
 */
function getSubtaskForDetailView(currentSubtask) {
    return `
        <div class="subtask-content">
            <button onclick="detailViewChangeSubtaskChecked(this)" type="button" data-id="${currentSubtask['id']}" data-checked="${currentSubtask['taskChecked']}"
                title="Check if the subtask is finished" class="checkbox-btn ${currentSubtask['taskChecked'] ? 'checkbox-btn-default-hover' : 'checkbox-btn-default'}"></button>
            <span id="subtask-text" class="subtask-text">${currentSubtask['title']}</span>
        </div>
    `;
}