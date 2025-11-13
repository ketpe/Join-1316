/**
 * @fileoverview
 * @namespace openCloseDialog
 * @description Opens and closes dialogs with specific content rendering functions.
 */

/**
 * @function openDialog
 * @memberof openCloseDialog
 * @description Opens a dialog and renders specific content
 * @param {string} dialogId - The ID of the dialog to open
 * @param {Function} renderSpecificFunction - The function to call to render specific content
 * @returns {void}
 */
function openDialog(dialogId, renderSpecificFunction) {
    toggleScrollOnBody(true);
    addDialogShowClass(dialogId);
    setEditDialogEventListeners();
    document.getElementById(dialogId).showModal();
    if (renderSpecificFunction) renderSpecificFunction();
}

/**
 * @function setEditDialogEventListeners
 * @memberof openCloseDialog
 * @description Sets event listeners for the edit dialog.
 * @returns {void}
 */
function setEditDialogEventListeners() {
    const dialog = document.getElementById("detail-view-task-dialog");
    if (!dialog) return;
    const onShown = () => {
        if (!dialog.classList.contains('dialog-show')) return;
        setTimeout(() => dialog.setAttribute('onclick', "closeDialogByEvent(event,'detail-view-task-dialog')"), 250);
        dialog.removeEventListener('animationend', onShown);
    };
    const cleanup = () => {
        dialog.removeAttribute('onclick');
        ['animationend', 'close', 'cancel'].forEach(e => dialog.removeEventListener(e, onShown));
    };
    dialog.addEventListener('animationend', onShown);
    dialog.addEventListener('close', cleanup);
    dialog.addEventListener('cancel', cleanup);
}


/**
 * @function closeDialogByEvent
 * @memberof openCloseDialog
 * @description Closes the dialog if the event target is the dialog background, close button, cancel button, or create button
 * @param {Event} event - The event that triggered the close
 * @param {string} dialogId - The ID of the dialog to close
 * @returns {void}
 */
function closeDialogByEvent(event, dialogId,) {
    event.stopPropagation();
    const dialog = document.getElementById(dialogId);
    const closeDiv = document.getElementById('btn-overlay-close-div');
    if (
        event.target == dialog ||
        event.target == closeDiv ||
        event.target.closest('.btn-clear-cancel') ||
        event.target.closest('.btn-create')
    ) {
        closeDialog(dialogId);
        if (dialogId == "detail-view-task-dialog") {
            getBoardTaskWithLoadingAnimation();
        }
    }
}

/**
 * @function closeDialog
 * @memberof openCloseDialog
 * @description Closes a dialog
 * @param {string} dialogId - The ID of the dialog to close
 * @return {void}
 */
function closeDialog(dialogId) {
    addDialogHideClass(dialogId);

    setTimeout(function () {
        document.getElementById(dialogId).close();

        toggleScrollOnBody(false);
    }, 1000);

}



/**
 * @function toggleScrollOnBody
 * @memberof openCloseDialog
 * @description Toggles the scroll on the body element
 * @param {boolean} open - Whether to open or close the scroll
 * @returns {void}
 */
function toggleScrollOnBody(open) {
    const bodyElement = document.getElementsByTagName('body')[0];
    open ? bodyElement.classList.add('dialog-open') : bodyElement.classList.remove('dialog-open');
}

/**
 * @function addDialogShowClass
 * @memberof openCloseDialog
 * @description Adds the show class to a dialog
 * @param {string} dialogId - The ID of the dialog to show
 * @return {void}
 */
function addDialogShowClass(dialogId) {
    let dialog = document.getElementById(dialogId);
    if (!dialog) { return; }
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

/**
 * @function addDialogHideClass
 * @memberof openCloseDialog
 * @description Adds the hide class to a dialog
 * @param {string} dialogId - The ID of the dialog to hide
 */
function addDialogHideClass(dialogId) {
    let dialog = document.getElementById(dialogId);
    dialog.classList.add('dialog-hide');
    dialog.classList.remove('dialog-show');
}


/**
 * @function renderDetailViewTemplate
 * @memberof openCloseDialog
 * @description Renders the detail view template into the dialog and fetches the task data
 * @param {string} taskId - The ID of the task to display
 * @return {Promise<void>}
 */
async function renderDetailViewTemplate(taskId) {
    await includeHtml("dialog-content-detail-view-task", "taskTemplate.html");
    getDetailViewTask(taskId);
}


/**
 * @function openSwapMobileMenu
 * @memberof openCloseDialog
 * @description Opens the swap mobile menu
 * @param {Event} event - The event that triggered the menu opening
 * @param {string} id - The ID of the task
 */
function openSwapMobileMenu(event, id) {
    event.stopPropagation();
    const overlay = document.getElementById(`swap-overlay-${id}`);
    overlay.style.display = 'block';
    const dialog = document.getElementById(`swap-mobile-menu-${id}`);
    dialog.style.display = 'block';
}

/**
 * @function closeSwapMobileMenu
 * @memberof openCloseDialog
 * @description Closes the swap mobile menu
 * @param {Event} event - The event that triggered the menu closing
 * @param {string} id - The ID of the task
 */
function closeSwapMobileMenu(event, id) {
    event.stopPropagation();
    const overlay = document.getElementById(`swap-overlay-${id}`);
    overlay.style.display = 'none';
    const dialog = document.getElementById(`swap-mobile-menu-${id}`);
    dialog.style.display = 'none';
}
