/**
 * Handles the opening and closing of the Add Task dialog.
 * Manages the rendering of content within the dialog and adjusts the view for dialog presentation.
 * Also includes utility functions for creating test data and defining data models.
 */

let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();
let addTaskDialogTaskComponents = null;

/**
 * Opens the Add Task dialog, renders the content, and adjusts the view for dialog presentation.
 * This function is asynchronous to accommodate data loading and rendering processes.
 * @returns {Promise<void>} A promise that resolves when the dialog is fully opened and rendered.
 */
async function onAddTaskDialogOpen() {
    addTaskDialogtoggleScrollOnBody(true);
    addDialogShowClass('add-task-dialog');
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialog();
    changeAddTaskViewToDialog();
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
    addTaskDialogTaskComponents = new TaskComponents(currentUser, "addTaskDialogTaskComponents");
    addTaskDialogTaskComponents.run();
    document.getElementsByTagName('body')[0].setAttribute("onmouseup", "addTaskDialogTaskComponents.addTaskWindowMouseClick(event)");
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
    const addTaskForm = document.getElementById('add-task-form');

    if(event.target == dialog || 
        event.target == closeDiv || 
        event.target.closest('.btn-clear-cancel') || 
        event.target.closest('.btn-create') ||
        event.target == addTaskForm
    ){
        addDialogHideClass('add-task-dialog');
        setTimeout(function() {
            dialog.close();
            document.getElementsByTagName('body')[0].removeAttribute("onmouseup");
            addTaskDialogtoggleScrollOnBody(false);
            taskComponents = null;
            getBoardTasks();
        }, 1000);
  
    }
}

/**
 * Toggles the scroll on the body element.
 * This function adds or removes the 'dialog-open' class on the body element,
 * which controls the scrolling behavior when a dialog is open.
 */
function addTaskDialogtoggleScrollOnBody(addClass) {
    let bodyElement = document.getElementsByTagName('body')[0];
    addClass ? bodyElement.classList.add('dialog-open') : bodyElement.removeAttribute('class');
}

/**
 * Renders the Add Task content into the dialog.
 * This function is asynchronous to accommodate the loading of HTML content.
 * It uses the includeHtml function to load the 'addTask.html' file into the dialog's content area.
 * @returns {Promise<void>} A promise that resolves when the content is fully rendered.
 */
async function renderAddTaskIntoDialog() {
    await Promise.all([
        includeHtml("dialog-content", "addTask.html")
    ]);
    const taskElements = new TaskElements("addTaskDialogTaskComponents");
    taskElements.fillLeftContainerOnAddTask();
    taskElements.fillRightContainerOnAddTask();
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