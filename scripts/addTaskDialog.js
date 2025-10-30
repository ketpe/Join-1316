/**
 * @namespace addTaskDialog
 * @description Handles the opening and closing of the Add Task dialog.
 * Manages the rendering of content within the dialog and adjusts the view for dialog presentation.
 * Also includes utility functions for creating test data and defining data models.
 * Loaded by board detail view page
 * @file scripts/addTaskDialog.js
 */

const DIALOGINDESKTOP_WIDTH = 1071;
const DIALOGINDESKTOP_HEIGHT = 890;

let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();
let addTaskDialogTaskComponents = null;
let resizeLockDialog = false;
let currentDialogView = "desktop";
let currentStateCategory = "todo";

/**
 * @description Opens the Add Task dialog, renders the content, and adjusts the view for dialog presentation.
 * This function is asynchronous to accommodate data loading and rendering processes.
 * The dialog view is adjusted based on the current window size to ensure optimal user experience.
 * The task state category can be specified to pre-select the appropriate column for the new task.
 * @function onAddTaskDialogOpen
 * @memberof addTaskDialog
 * @param {string} stateCategory - The state category to which the new task will be added (e.g., "todo", "inprogress", "awaiting").
 * @returns {Promise<void>} A promise that resolves when the dialog is fully opened and rendered.
 */
async function onAddTaskDialogOpen(stateCategory = "todo") {
    currentStateCategory = stateCategory;
    const [height, width] = addTaskUtils.getCurrentAddTaskSize;

    if (width <= 880) {
        navigateToAddTask(null, currentStateCategory);
    } else if (height >= DIALOGINDESKTOP_HEIGHT && width >= DIALOGINDESKTOP_WIDTH) {
        currentDialogView = "desktop";
        await showAddTaskAsDialog();
        giveFunctionsToBoardBody();
    } else {
        currentDialogView = "desktop-single";
        showAddTaskAsDialogSingle();
        giveFunctionsToBoardBody();
    }

    currentDialogView == "desktop-single" ? changeAddTaskFormFieldSizeBoardDialogSingle() : changeAddTaskFormFieldSizeBoardDialog();
}

/**
 * @description Handles the resizing of the Add Task dialog.
 * @function resizeAddTaskBoardDialog
 * @memberof addTaskDialog
 * @param {Event} event - The resize event.
 * @returns {Promise<void>}
 */
async function resizeAddTaskBoardDialog(event) {
    if (resizeLockDialog) { return; }
    resizeLockDialog = true;
    const dialog = document.getElementById('add-task-dialog');
    if (!dialog) { return; }
    if (!dialog.classList.contains('dialog-show')) { return; }

    const [height, width] = addTaskUtils.getCurrentAddTaskSize;

    if (width <= 880) {
        navigateToAddTask(null, currentStateCategory);
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

/**
 * @description Displays the Add Task dialog in desktop mode.
 * Captures current form data, clears dialog content, and renders the Add Task components.
 * Adjusts the dialog view for desktop presentation.
 * @function showAddTaskAsDialog
 * @memberof addTaskDialog
 * @returns {Promise<void>}
 */
async function showAddTaskAsDialog() {
    AddTaskUtils.captureCurrentAddTaskDataFromView();
    clearDialogContent();
    addTaskDialogtoggleScrollOnBody(true);
    addDialogShowClass('add-task-dialog');
    setDialogEventListener();
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialog();
    changeAddTaskViewToDialog();
    await loadDataForAddTaskDialog();
}

/**
 * @description Sets event listeners for the Add Task dialog.
 * Specifically, it sets up listeners for animation end events to assign click and resize handlers.
 * @function setDialogEventListener
 * @memberof addTaskDialog
 * @returns {void}
 */
function setDialogEventListener() {
    const dialog = document.querySelector('#add-task-dialog.dialog-show');
    dialog.addEventListener('animationend', () => {
        setTimeout(() => {
            dialog.setAttribute('onclick', "addTaskDialogClose(event)");
            dialog.setAttribute('onresize', "resizeAddTaskBoardDialog(this)");
        }, 200);
    });
}

/**
 * @description Displays the Add Task dialog in desktop single-column mode.
 * Captures current form data, clears dialog content, and renders the Add Task components.
 * Adjusts the dialog view for single-column presentation.
 * @function showAddTaskAsDialogSingle
 * @memberof addTaskDialog
 * @returns {Promise<void>}
 */
async function showAddTaskAsDialogSingle() {
    AddTaskUtils.captureCurrentAddTaskDataFromView();
    clearDialogContent();
    addTaskDialogtoggleScrollOnBody(true);
    addDialogShowClass('add-task-dialog');
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialogSingle();
    await loadDataForAddTaskDialog();
}

/**
 * @description Loads data for the Add Task dialog.
 * Initializes the TaskComponents class if not already done, sets up button functions, and applies data to the view.
 * @function loadDataForAddTaskDialog
 * @memberof addTaskDialog
 * @returns {Promise<void>}
 */
async function loadDataForAddTaskDialog() {
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
    if (!addTaskDialogTaskComponents) {
        addTaskDialogTaskComponents = new TaskComponents(currentUser, "addTaskDialogTaskComponents", currentStateCategory);
        addTaskDialogTaskComponents.run();
        window.addTaskDialogTaskComponents = addTaskDialogTaskComponents;
    }

    addTaskUtils.setAddTaskCreateBtnMouseFunction('createTaskButton', 'addTaskDialogTaskComponents');
    AddTaskUtils.applyAddTaskDataToView(addTaskDialogTaskComponents);
    addTaskUtils.setAddTaskFormSubmitFunction("addTaskDialogTaskComponents", true);
}

/**
 * @description Clears the content of the Add Task dialog.
 * This function removes all HTML content from the dialog's content area.
 * @function clearDialogContent
 * @memberof addTaskDialog
 * @returns {void}
 */
function clearDialogContent() {
    document.getElementById('dialog-content').innerHTML = "";
}

/**
 * @description Gives necessary functions to the board body element.
 * @function giveFunctionsToBoardBody
 * @memberof addTaskDialog
 * @returns {void}
 */
function giveFunctionsToBoardBody() {
    const body = document.querySelector('body');
    if (!body) { return; }
    body.setAttribute("onmouseup", "addTaskDialogTaskComponents.addTaskWindowMouseClick(event)");
    body.setAttribute("onresize", "resizeAddTaskBoardDialog(event)");
}

/**
 * @description Check if can close the dialog.
 * This function is triggered when the user attempts to close the dialog.
 * It hides the dialog and resets any form fields as necessary.
 * @function addTaskDialogClose
 * @memberof addTaskDialog
 * @param {Event} event - The event that triggered the close action.
 * @return {void}
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

        closeTheDialog(dialog);
    }
}


/**
 * @description Closes the specified dialog.
 * @function closeTheDialog
 * @memberof addTaskDialog
 * @param {HTMLDialogElement} dialog - The dialog element to close.
 * @param {string} dialogID - The ID of the dialog element.
 * @returns {void}
 */
function closeTheDialog(dialog, dialogID = "") {

    const dialogAddTask = dialog ? dialog : document.getElementById(dialogID);

    addDialogHideClass('add-task-dialog');
    setTimeout(function () {
        dialogAddTask.close();
        document.getElementsByTagName('body')[0].removeAttribute("onmouseup");
        addTaskDialogtoggleScrollOnBody(false);
        addTaskDialogTaskComponents = null;
        navigateToBoard();
    }, 1000);
}

/**
 * @description Toggles the scroll on the body element.
 * This function adds or removes the 'dialog-open' class on the body element,
 * which controls the scrolling behavior when a dialog is open.
 * @function addTaskDialogtoggleScrollOnBody
 * @memberof addTaskDialog
 * @param {boolean} addClass - If true, adds the 'dialog-open' class; if false, removes it.
 * @returns {void}
 */
function addTaskDialogtoggleScrollOnBody(addClass) {
    let bodyElement = document.getElementsByTagName('body')[0];
    addClass ? bodyElement.classList.add('dialog-open') : bodyElement.removeAttribute('class');
}

/**
 * @description Renders the Add Task content into the dialog.
 * This function is asynchronous to accommodate the loading of HTML content.
 * It uses the includeHtml function to load the 'addTaskContent.html' file into the dialog's content area.
 * @function renderAddTaskIntoDialog
 * @memberof addTaskDialog
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

/**
 * @description Renders the Add Task content into the dialog in single-column mode.
 * This function is asynchronous to accommodate the loading of HTML content.
 * It uses the includeHtml function to load the 'addTaskContentSingle.html' file into the dialog's content area.
 * It also initializes and starts rendering the Add Task Mobile utilities.
 * @function renderAddTaskIntoDialogSingle
 * @memberof addTaskDialog
 * @returns {Promise<void>} A promise that resolves when the content is fully rendered.
 */
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

/**
 * @description Adjusts the form field sizes for the Add Task dialog in single-column mode.
 * This function calculates the appropriate heights for the dialog and its fields based on the current window size.
 * It ensures that the form fields are displayed correctly within the dialog.
 * @function changeAddTaskFormFieldSizeBoardDialogSingle
 * @memberof addTaskDialog
 * @returns {void}
 */
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

/**
 * @description Adjusts the form field sizes for the Add Task dialog in board mode.
 * This function calculates the appropriate heights for the dialog and its fields based on the current window size.
 * It ensures that the form fields are displayed correctly within the dialog.
 * @function changeAddTaskFormFieldSizeBoardDialog
 * @memberof addTaskDialog
 * @param {*} params
 * @returns {void}
 */
function changeAddTaskFormFieldSizeBoardDialog(params) {
    const [height, width] = addTaskUtils.getCurrentAddTaskSize;
    const dialog = document.getElementById('add-task-dialog');
    const heightDialog = height - 100;
    dialog.style.height = heightDialog + "px";
}

/**
 * @description Changes the dialog style to single-column mode.
 * @function changeDialogStyleToSingle
 * @memberof addTaskDialog
 * @returns {void}
 */
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


/**
 * @description Changes the view of the Add Task form to be suitable for dialog presentation.
 * This function adjusts various elements' classes to ensure the form is displayed correctly within a dialog.
 * It modifies visibility, layout, and styling to enhance user experience in the dialog context.
 * @function changeAddTaskViewToDialog
 * @memberof addTaskDialog
 * @return {void}
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

/**
 * @description Adds the show class to the Add Task dialog.
 * This function modifies the dialog's classes to make it visible with appropriate styling.
 * @function addDialogShowClass
 * @memberof addTaskDialog
 * @return {void}
 */
function addDialogShowClass() {
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

/**
 * @description Adds the hide class to the Add Task dialog.
 * This function modifies the dialog's classes to hide it with appropriate styling.
 * @function addDialogHideClass
 * @memberof addTaskDialog
 * @return {void}
 */
function addDialogHideClass() {
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-show');
    dialog.classList.add('dialog-hide');
}