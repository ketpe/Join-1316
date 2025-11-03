/**
 * @fileoverview
 * @namespace boardUtils
 * @description Utility functions for the Kanban board. handling responsive design and task interactions.
 */
/**
 * @function setTaskViewEditDialogSize
 * @memberof boardUtils
 * @description Set the height of the task edit dialog based on the current window size.
 * set height of main content area in task edit dialog and toggle scroll class.
 * @param {number} height - The height to set for the dialog.
 * @returns {void}
 */
function setTaskViewEditDialogSize(height) {
    const editDialog = document.querySelector('#detail-view-task-dialog.dialog-show');
    if (!editDialog) { return; }
    const taskSection = editDialog.querySelector('.task-section');
    if (!taskSection) { return; }
    const taskMain = taskSection.querySelector('.task-main') ?? taskSection.querySelector('.task-main-edit');
    if (!taskMain) return;
    const sumHeightsInDialog = headerHeight + mainContentHeight + footerHeight + 60;

    if (height - 200 > sumHeightsInDialog) {
        taskSection.style.height = (sumHeightsInDialog + 40) + "px";
        taskMain.classList.remove('task-main-scroll');
    } else {
        taskSection.style.height = (height - 200) + "px";
        taskMain.style.height = (height - 200 - headerHeight - footerHeight) + "px";
        taskMain.classList.add('task-main-scroll');
    }
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

