/**
 * @fileoverview
 * @namespace boardUtils
 * @description Utility functions for the Kanban board. handling responsive design and task interactions.
 */
/**
 * @function setTaskViewEditDialogSize
 * @memberof boardUtils
 * @description Sets the size of the task view/edit dialog based on its content.
 * @returns {void}
 */
function setTaskViewEditDialogSize() {
    const editDialog = document.querySelector('#detail-view-task-dialog.dialog-show');
    if (!editDialog) { return; }
    const taskSection = editDialog.querySelector('.task-section');
    if (!taskSection) { return; }
    const taskMain = taskSection.querySelector('.task-main') ?? taskSection.querySelector('.task-main-edit');
    if (!taskMain) return;

    const needScrollbar = taskMain.scrollHeight > Math.ceil(taskMain.clientHeight) + 1;
    taskMain.style.overflowY = needScrollbar ? 'auto' : 'hidden';

}

/**
 * @function kanbanUpdateSizeDesktop
 * @memberof boardUtils
 * @description Updates the height of the Kanban board for Desktop based on the window size and header heights.
 * This function calculates the available height for the Kanban board by subtracting the heights of the header and board header from the total window height,
 * and then sets the height of the Kanban board element accordingly.
 * @returns {void}
 */
function kanbanUpdateSizeDesktop() {
    const headerHeight = document.getElementById('header').offsetHeight;
    const boardHeaderHeight = document.querySelector('.board-header').offsetHeight;
    const windowsHeight = window.innerHeight;
    const kanbanHeight = windowsHeight - (headerHeight + boardHeaderHeight + 20);
    document.getElementById('board-kanban').style.height = kanbanHeight + "px";
}

/**
 * @function kanbanUpdateSizeMobile
 * @memberof boardUtils
 * @description Updates the height of the Kanban board for mobile view based on the window size and header heights.
 * This function calculates the available height for the Kanban board by subtracting the heights of the header and
 * mobile navigation from the total window height, and then sets the height of the mobile Kanban board element accordingly.
 * @return {void}
 */
function kanbanUpdateSizeMobile() {
    const headerHeight = document.getElementById('header').offsetHeight;
    const navHeight = document.querySelector('.nav-mobile').offsetHeight;
    const windowsHeight = window.innerHeight;
    const kanbanHeight = windowsHeight - (headerHeight + navHeight + 20);
    document.querySelector('.board-main-content-mobile').style.height = kanbanHeight + "px";
}

/**
 * @function toggleSubtaskCheckbox
 * @memberof boardUtils
 * @description Toggles the checked state of a subtask checkbox.
 * @param {HTMLElement} element - The checkbox element to toggle.
 * @returns {void}
 */
function toggleSubtaskCheckbox(element) {
    const btn = element;
    btn.classList.toggle('checkbox-btn-default');
    btn.classList.toggle('checkbox-btn-default-hover');
}
/**
 * @function renderAssignedContacts
 * @memberof boardUtils
 * @description Renders the assigned contacts for a task.
 * @param {Array} assignedContacts - The list of assigned contacts to render.
 * @returns {string} - The HTML string representing the assigned contacts.
 */
function renderAssignedContacts(assignedContacts) {
    let breakExecption = {};
    let assignedContactsTemplate = '';
    let counter = 0;
    try {
        assignedContacts.forEach(contactArr => {
            if (counter >= 5) {
                assignedContactsTemplate = renderLimitedContactsTemplate(counter, assignedContacts.length, assignedContactsTemplate); throw breakExecption;
            }
            contactArr.forEach(contact => { assignedContactsTemplate += getAllAssignedContactsTemplate(contact); });
            counter++;
        });
    } catch (error) { return assignedContactsTemplate; }
    return assignedContactsTemplate;
}
/**
 *
 * @function renderLimitedContactsTemplate
 * @memberof boardUtils
 * @description Renders the assigned contacts for a task with a limit on visible contacts.
 * @param {number} counter - The current count of rendered contacts.
 * @param {number} total - The total number of assigned contacts.
 * @param {string} assignedContactsTemplate - The HTML template for the assigned contacts.
 * @returns {string} - The updated HTML template with the limited contacts.
 */
function renderLimitedContactsTemplate(counter, total, assignedContactsTemplate) {
    let invisibleContacts = total - counter;
    assignedContactsTemplate += getContactsTemplateOverflow(invisibleContacts);
    return assignedContactsTemplate;
}

/**
 * @function getLineHeight
 * @memberof boardUtils
 * @description Gets the line height of an element.
 * @param {HTMLElement} element - The element to get the line height from.
 * @returns {number} - The line height of the element.
 */
function getLineHeight(element) {
    const style = getComputedStyle(element);
    let lh = parseFloat(style.lineHeight);
    if (isNaN(lh)) lh = parseFloat(style.fontSize) * 1.2;
    return lh;
}

/**
 * @function getOriginalText
 * @memberof boardUtils
 * @description Gets the original text of an element.
 * @param {HTMLElement} element - The element to get the original text from.
 * @returns {string} - The original text of the element.
 */
function getOriginalText(element) {
    let orig = element.getAttribute('data-original-text');
    if (!orig) {
        orig = element.textContent;
        element.setAttribute('data-original-text', orig);
    }
    return orig;
}

/**
 * @function clampTextToLines
 * @memberof boardUtils
 * @description Clamps the text of an element to a certain number of lines.
 * @param {HTMLElement} element - The element whose text should be clamped.
 * @param {number} lines - The number of lines to clamp to.
 * @returns {void}
 */
function clampTextToLines(element, lines = 2) {
    const lineHeight = getLineHeight(element);
    const maxHeight = lineHeight * lines;
    let orig = getOriginalText(element);
    element.textContent = orig;
    while (element.scrollHeight > maxHeight && element.textContent.length > 0) {
        element.textContent = element.textContent.slice(0, -1);
    }
    if (element.textContent !== orig) {
        element.textContent = element.textContent.trim().slice(0, -3) + '...';
    }
}
/**
 * @function clampBoardTaskTitles
 * @memberof boardUtils
 * @description Clamps the titles of all board tasks to two lines.
 * @returns {void}
 */
function clampBoardTaskTitles() {
    document.querySelectorAll('.board-task-title').forEach(title => {
        const p = title.querySelector('p') || title;
        clampTextToLines(p, 2);
    });
}