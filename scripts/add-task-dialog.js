/**
 * Handles the opening and closing of the Add Task dialog.
 * Manages the rendering of content within the dialog and adjusts the view for dialog presentation.
 * Also includes utility functions for creating test data and defining data models.
 */


/**
 * Opens the Add Task dialog, renders the content, and adjusts the view for dialog presentation.
 * This function is asynchronous to accommodate data loading and rendering processes.
 * @returns {Promise<void>} A promise that resolves when the dialog is fully opened and rendered.
 */
async function onAddTaskDialogOpen() {
    toggleScrollOnBody();
    addDialogShowClass('add-task-dialog');
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialog();
    changeAddTaskViewToDialog();
    await loadDataForAddTask(true);
}

/**
 * Closes the Add Task dialog.
 * This function is triggered when the user attempts to close the dialog.
 * It hides the dialog and resets any form fields as necessary.
 * @param {Event} event - The event that triggered the close action.
 */
function addTaskDialogClose(event) {

    const dialog = document.getElementById('add-task-dialog');
    const closeDiv = document.getElementById('a-t-dialog-close-div');
    const cancelButton = document.getElementById('a-t-cancel-btn');
    if(event.target == dialog || event.target == closeDiv || event.target == cancelButton){
        addDialogHideClass('add-task-dialog');
        setTimeout(function() {
            dialog.close();
            toggleScrollOnBody();
        }, 1000);
  
    }
}

/**
 * Toggles the scroll on the body element.
 * This function adds or removes the 'dialog-open' class on the body element,
 * which controls the scrolling behavior when a dialog is open.
 */
function toggleScrollOnBody() {
    document.getElementsByTagName('body')[0].classList.toggle('dialog-open');
}

/**
 * Renders the Add Task content into the dialog.
 * This function is asynchronous to accommodate the loading of HTML content.
 * It uses the includeHtml function to load the 'add-task.html' file into the dialog's content area.
 * @returns {Promise<void>} A promise that resolves when the content is fully rendered.
 */
async function renderAddTaskIntoDialog() {
    await Promise.all([
        includeHtml("dialog-content", "add-task.html")
    ]);
}

/** Changes the view of the Add Task form to be suitable for dialog presentation.
 * This function adjusts various elements' classes to ensure the form is displayed correctly within a dialog.
 * It modifies visibility, layout, and styling to enhance user experience in the dialog context.
 */
function changeAddTaskViewToDialog() {
    document.getElementById('a-t-dialog-close-btn').classList.remove('display-hidden');
    document.getElementById('a-t-cancel-btn').classList.remove('display-hidden');
    document.getElementById('a-t-clear-btn').classList.add('display-hidden');
    document.getElementById('add-task-form').classList.remove('add-task-form-desktop');
    document.getElementById('add-task-form').classList.add('add-task-form-dialog');
    document.getElementById('a-t-middle-container').classList.add('a-t-f-i-midle-dialog');
    document.getElementById('due-date-hidden').classList.add('date-input-hidden-dialog');
    document.querySelector('h1').classList.add('join-h1-dialog');
    document.querySelector('.add-task-head').classList.add('mb-24');
}

/** Adds the show class to the Add Task dialog.
 * This function modifies the dialog's classes to make it visible with appropriate styling.
 */
function addDialogShowClass() {
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

/** Adds the hide class to the Add Task dialog.
 * This function modifies the dialog's classes to hide it with appropriate styling.
 */
function addDialogHideClass(){
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-show');
    dialog.classList.add('dialog-hide');
}