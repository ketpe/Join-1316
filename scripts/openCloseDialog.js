/**
 * Opens a dialog and renders specific content
 * @param {string} dialogId - The ID of the dialog to open
 * @param {Function} renderSpecificFunction - The function to call to render specific content
 */
//NOTE - Allgemeine Dialogfunktion.
function openDialog(dialogId, renderSpecificFunction) {
    toggleScrollOnBody(true);
    addDialogShowClass(dialogId);
    document.getElementById(dialogId).showModal();
    if (renderSpecificFunction) renderSpecificFunction();
}
/** * Closes a dialog based on an event
 * @param {Event} event - The event that triggered the close
 * @param {string} dialogId - The ID of the dialog to close
 * @description Closes the dialog if the event target is the dialog background, close button, cancel button, or create button
 */
function closeDialogByEvent(event, dialogId) {
    //resetAddTaskVariables();
    
    const dialog = document.getElementById(dialogId);
    const closeDiv = document.getElementById('btn-overlay-close-div');
    if (
        event.target == dialog ||
        event.target == closeDiv ||
        event.target.closest('.btn-clear-cancel') ||
        event.target.closest('.btn-create')
    ) {
        closeDialog(dialogId);
    }
}

/**
 * Closes a dialog
 * @param {string} dialogId - The ID of the dialog to close
 */
function closeDialog(dialogId) {
    addDialogHideClass(dialogId);
    setTimeout(function () {
        document.getElementById(dialogId).close();
        toggleScrollOnBody(false);
    }, 1000);
}
/**
 * Toggles the scroll on the body element
 */
function toggleScrollOnBody(open) {
    const bodyElement = document.getElementsByTagName('body')[0];
    open ? bodyElement.classList.add('dialog-open') : bodyElement.classList.remove('dialog-open');
}

/**
 * Adds the show class to a dialog
 * @param {string} dialogId - The ID of the dialog to show
 */
function addDialogShowClass(dialogId) {
    let dialog = document.getElementById(dialogId);
    if (!dialog) { return; }
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

/**

 * Closes the dialog

 * @param {string} dialogId - The ID of the dialog to close

 */

function addDialogHideClass(dialogId) {
    let dialog = document.getElementById(dialogId);
    dialog.classList.add('dialog-hide');
    dialog.classList.remove('dialog-show');
}


//NOTE Spezifische Dialogfunktionen. Kann in renderSpecificFunction übergeben werden.

/**
 * Renders the add contact form into the dialog
 */
function renderAddContactIntoDialog() {
    includeHtml("dialog-content-contacts", "addContact.html");
}
async function renderDetailViewTemplate(taskId) {
    await includeHtml("dialog-content-detail-view-task", "taskTemplate.html");
    getDetailViewTask(taskId);
}
