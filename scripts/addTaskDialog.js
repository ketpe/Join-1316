/**
 * Handles the opening and closing of the Add Task dialog.
 * Manages the rendering of content within the dialog and adjusts the view for dialog presentation.
 * Also includes utility functions for creating test data and defining data models.
 */

const DIALOGINDESKTOP_WIDTH = 1071;
const DIALOGINDESKTOP_HEIGHT = 890;

let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();
let addTaskDialogTaskComponents = null;
let resizeLockDialog = false;
let currentDialogView = "desktop";

/**
 * Opens the Add Task dialog, renders the content, and adjusts the view for dialog presentation.
 * This function is asynchronous to accommodate data loading and rendering processes.
 * @returns {Promise<void>} A promise that resolves when the dialog is fully opened and rendered.
 */
async function onAddTaskDialogOpen() {
    const [height, width] = addTaskUtils.getCurrentAddTaskSize;

    if (width <= 880) {
        navigateToAddTask();
    } else if (height >= DIALOGINDESKTOP_HEIGHT && width >= DIALOGINDESKTOP_WIDTH) {
        currentDialogView = "desktop";
        await showAddTaskAsDialog();
        giveFunctionsToBoardBody();
    } else {
        currentDialogView = "desktop-single";
        showAddTaskAsDialogSingle();
        giveFunctionsToBoardBody();
    }
}

//TODO - Speichern der Daten vornehmen -> Achtung "Fallstrick" beachten

async function resizeAddTaskBoardDialog(event) {
    if (resizeLockDialog) { return; }
    resizeLockDialog = true;
    const dialog = document.getElementById('add-task-dialog');
    if (!dialog) { return; }
    if (!dialog.classList.contains('dialog-show')) { return; }

    const [height, width] = addTaskUtils.getCurrentAddTaskSize;

    if (width <= 880) {
        navigateToAddTask();
    } else if (height >= DIALOGINDESKTOP_HEIGHT && width >= DIALOGINDESKTOP_WIDTH && currentDialogView != "desktop") {
        currentDialogView = "desktop";
        await showAddTaskAsDialog();
    } else if ((height < DIALOGINDESKTOP_HEIGHT || width < DIALOGINDESKTOP_WIDTH) && currentDialogView != "desktop-single") {
        currentDialogView = "desktop-single";
        await showAddTaskAsDialogSingle();
    }

    currentDialogView == "desktop-single" ? changeAddTaskFormFieldSizeBoardDialogSingle() : changeAddTaskFormFieldSizeBoardDialog();
    resizeLockDialog = false;
}

//TODO - TaskComponents hier rausnehmen und nachladen, wie bei addTask.js
async function showAddTaskAsDialog() {
    clearDialogContent();
    addTaskDialogtoggleScrollOnBody(true);
    addDialogShowClass('add-task-dialog');
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialog();
    changeAddTaskViewToDialog();
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
    addTaskDialogTaskComponents = new TaskComponents(currentUser, "addTaskDialogTaskComponents");
    addTaskDialogTaskComponents.run();
    addTaskUtils.setAddTaskCreateBtnMouseFunction('createTaskButton', 'addTaskDialogTaskComponents');
}


async function showAddTaskAsDialogSingle() {
    clearDialogContent();
    addTaskDialogtoggleScrollOnBody(true);
    addDialogShowClass('add-task-dialog');
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialogSingle();
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
}

function clearDialogContent() {
    document.getElementById('dialog-content').innerHTML = "";
}

function giveFunctionsToBoardBody() {
    const body = document.querySelector('body');
    if (!body) { return; }
    body.setAttribute("onmouseup", "addTaskDialogTaskComponents.addTaskWindowMouseClick(event)");
    body.setAttribute("onresize", "resizeAddTaskBoardDialog(event)");
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
    const dialogContent = document.getElementById('dialog-content');

    if (event.target == addTaskForm) { return; }
    if (event.target == dialogContent) { return; }

    if (event.target == dialog ||
        event.target == closeDiv ||
        event.target.closest('.btn-clear-cancel') ||
        event.target.closest('.btn-create')
    ) {
        addDialogHideClass('add-task-dialog');
        setTimeout(function () {
            dialog.close();
            document.getElementsByTagName('body')[0].removeAttribute("onmouseup");
            addTaskDialogtoggleScrollOnBody(false);
            addTaskDialogTaskComponents = null;
            navigateToBoard();
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
 * It uses the includeHtml function to load the 'addTaskContent.html' file into the dialog's content area.
 * @returns {Promise<void>} A promise that resolves when the content is fully rendered.
 */
async function renderAddTaskIntoDialog() {
    await Promise.all([
        includeHtml("dialog-content", "addTaskContent.html")
    ]);
    const taskElements = new TaskElements("addTaskDialogTaskComponents");
    taskElements.fillLeftContainerOnAddTask();
    taskElements.fillRightContainerOnAddTask();
}

async function renderAddTaskIntoDialogSingle() {
    await Promise.all([
        includeHtml("dialog-content", "addTaskContentSingle.html")
    ]).then(() => {
        const taskMobileUtil = new AddTaskMobileUtil("addTaskDialogTaskComponents");
        taskMobileUtil.startRenderAddTaskMobile();
    }).then(() => {
        changeDialogStyleToSingle();
    });

}

function changeAddTaskFormFieldSizeBoardDialogSingle() {

    const [height, width] = addTaskUtils.getCurrentAddTaskSize;
    const dialog = document.getElementById('add-task-dialog');
    const heightDialog = height - 100;
    dialog.style.height = heightDialog + "px";
    addTaskUtils.measureTheRemainingSpaceOfFieldsForBoardSingle(heightDialog)
        .then((result) => {
            document.querySelector('.add-task-mobile-fields').style.height = result + "px";
        });
}

function changeAddTaskFormFieldSizeBoardDialog(params) {
    const [height, width] = addTaskUtils.getCurrentAddTaskSize;
    const dialog = document.getElementById('add-task-dialog');
    const heightDialog = height - 100;
    dialog.style.height = heightDialog + "px";
}


function changeDialogStyleToSingle() {
    const dialog = document.getElementById('add-task-dialog');
    if (!dialog) { return; }
    dialog.classList.remove('add-task-dialog');
    dialog.classList.add('add-task-board-dialog-single');
    const headLine = dialog.querySelector('h1');
    if (!headLine) { return; }
    headLine.classList.remove('join-h1');
    headLine.classList.add('join-h1-dialog-sm');
    const fields = dialog.querySelector('.add-task-mobile-fields');
    if (!fields) { return; }
    fields.classList.add('mb-24');
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
function addDialogHideClass() {
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-show');
    dialog.classList.add('dialog-hide');
}