/**
 * Opens a dialog and renders specific content
 * @param {string} dialogId - The ID of the dialog to open
 * @param {Function} renderSpecificFunction - The function to call to render specific content
 */
//NOTE - Allgemeine Dialogfunktion.
function openDialog(dialogId, renderSpecificFunction) {
    toggleScrollOnBody();
    addDialogShowClass(dialogId);
    document.getElementById(dialogId).showModal();
    if (renderSpecificFunction) renderSpecificFunction();
}
/** * Closes a dialog based on an event
 * @param {Event} event - The event that triggered the close
 * @param {string} dialogId - The ID of the dialog to close
 */
function closeDialogByEvent(event, dialogId) {
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
        toggleScrollOnBody();
    }, 1000);
}
/**
 * Toggles the scroll on the body element
 */
function toggleScrollOnBody() {
    document.getElementsByTagName('body')[0].classList.toggle('dialog-open');
}

/**
 * Adds the show class to a dialog
 * @param {string} dialogId - The ID of the dialog to show
 */
function addDialogShowClass(dialogId) {
    let dialog = document.getElementById(dialogId);
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

/**

 * Closes the dialog

 * @param {string} dialogId - The ID of the dialog to close

 */

function addDialogHideClass(dialogId) {
    let dialog = document.getElementById(dialogId);
    dialog.classList.remove('dialog-show');
    dialog.classList.add('dialog-hide');
}


//NOTE Spezifische Dialogfunktionen. Kann in renderSpecificFunction übergeben werden.

/**
 * Renders the add contact form into the dialog
 */
function renderAddContactIntoDialog() {
    includeHtml("dialog-content-contacts", "add-contact.html");
}
async function renderDetailViewTemplate(taskId) {
    await includeHtml("dialog-content-detail-view-task", "task-template.html");
    // getDetailViewTask(taskId);
}
