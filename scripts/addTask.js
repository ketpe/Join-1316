const MOBILE = "mobile";
const DESKTOP = "desktop";
const DESKTOPSINGLE = "desktopSingle";
const minDesktopHeight = 880;
const breakPointToDesktopSingle = 1180;
const breakPointToMobile = 800;

let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();
let addTasktaskComponents = null;
let currentView = "";
let resizeLock = false;


/**
 * Initializes the Add Task page on load.
 * Sets up the layout based on the current window size and adjusts form field sizes.
 * @returns {Promise<void>}
 */
async function onLoadAddTask() {
    checkUserOrGuestIsloggedIn();
    const [height, width] = addTaskUtils.getCurrentAddTaskSize;
    if (width >= breakPointToDesktopSingle) {
        await changeAddTaskToDesktop(height, width);
    } else if (width < breakPointToDesktopSingle && width > breakPointToMobile) {
        await changeAddTaskToDesktopSingle(height, width);
    } else {
        await changeAddTaskToMobile(height, width);
    }

    changeAddTaskFormFieldSize(height, width, currentView);
}

/** 
 * Handles window resize events to adjust the Add Task page layout.
 * Uses a lock to prevent multiple simultaneous executions.
 * Adjusts the layout based on predefined breakpoints and resizes form fields accordingly.
 * @returns {Promise<void>}
 */
async function addTaskPageResize() {
    if (resizeLock) { return; }
    resizeLock = true;

    try {
        const [height, width] = addTaskUtils.getCurrentAddTaskSize;
        if (width <= breakPointToMobile && currentView !== MOBILE) {
            AddTaskUtils.captureCurrentAddTaskDataFromView();
            await changeAddTaskToMobile(height, width);
        } else if (width >= breakPointToDesktopSingle && currentView !== DESKTOP) {
            AddTaskUtils.captureCurrentAddTaskDataFromView();
            await changeAddTaskToDesktop(height, width);
        } else if (width > breakPointToMobile && width <= breakPointToDesktopSingle && currentView != DESKTOPSINGLE) {
            AddTaskUtils.captureCurrentAddTaskDataFromView();
            await changeAddTaskToDesktopSingle(height, width);
        }

        changeAddTaskFormFieldSize(height, width, currentView);
    }finally{
        resizeLock = false;
    }
}

/**
 * Changes the Add Task view to desktop mode.
 * Loads the necessary HTML components and adjusts the view to standard mode.
 * Also loads data for the Add Task view and sets the navigation button as active.
 * @returns {Promise<void>}
 */
async function changeAddTaskToDesktop() {
    currentView = DESKTOP;
    await loadHtmlComponentsForDesktop();
    changeAddTaskViewToStandard();
    await loadDataForAddTask();
    setNavigationButtonActive('addTask', "desktop");

}

/**
 * Changes the Add Task view to desktop single-column mode.
 * Loads the necessary HTML components and adjusts the view to standard mode.
 * Also loads data for the Add Task view and sets the navigation button as active.
 * @returns {Promise<void>}
 */
async function changeAddTaskToDesktopSingle() {
    currentView = DESKTOPSINGLE;
    await loadHtmlComponentsForDesktopSingle();
    await loadDataForAddTask();
    setNavigationButtonActive('addTask', "desktop");
    document.querySelector('body').setAttribute("onmouseup", "addTasktaskComponents.addTaskWindowMouseClick(event)");
}

/**
 * Changes the Add Task view to mobile mode.
 * Loads the necessary HTML components and loads data for the Add Task view.
 * Also sets the navigation button as active.
 * @returns {Promise<void>}
 */
async function changeAddTaskToMobile() {
    currentView = MOBILE;
    await loadHtmlComponentsForMobile();
    await loadDataForAddTask();
    setNavigationButtonActive('addTask', "mobile");
    document.querySelector('body').setAttribute("onmouseup", "addTasktaskComponents.addTaskWindowMouseClick(event)");
}

/**
 * Changes the size of the form fields in the Add Task view based on the current layout.
 * @param {number} height The current height of the form fields.
 * @param {number} width The current width of the form fields.
 * @param {string} currentView The current view mode (mobile, desktop, etc.).
 */
function changeAddTaskFormFieldSize(height, width, currentView) {
    if (currentView == MOBILE) {
        addTaskUtils.measureTheRemainingSpaceOfFieldsForMobile(height)
            .then((result) => {
                document.querySelector(".add-task-mobile-fields").style.height = result + "px";
            });
    } else if (currentView == DESKTOP) {
        addTaskUtils.measureTheRemainingSpaceOfFieldsForDesktop(height)
            .then((result) => {
                document.querySelector(".add-task-fields").style.height = result + "px";
            });
    }else if(currentView == DESKTOPSINGLE){
        addTaskUtils.measureTheRemainingSpaceOfFieldsForDesktopSingle(height)
            .then((result) => {
                document.querySelector(".add-task-mobile-fields").style.height = result + "px";
            });
    }
}

/**
 * Loads the HTML components for the Add Task view in desktop mode.
 * Clears the current body content and includes necessary HTML files for the layout.
 * Fills the HTML with content after loading the components.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForDesktop() {
    clearAddTaskHtmlBody();
    await includeHtmlForNode("body", "addTaskDesktop.html");

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),
        includeHtml("add-task-content", "addTaskContent.html")
    ]);

    await fillHtmlWithContent();
}

/**
 * Loads the HTML components for the Add Task view in desktop single-column mode.
 * Clears the current body content and includes necessary HTML files for the layout.
 * Fills the HTML with content after loading the components.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForDesktopSingle() {
    clearAddTaskHtmlBody();
    await includeHtmlForNode("body", "addTaskDesktop.html");

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),
        includeHtml("add-task-content", "addTaskContentMobile.html")
    ]);

    await fillMobileHtmlWithContent();

}

/**
 * Loads the HTML components for the Add Task view in mobile mode.
 * Clears the current body content and includes necessary HTML files for the layout.
 * Fills the HTML with content after loading the components.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForMobile() {
    clearAddTaskHtmlBody();

    await includeHtmlForNode("body", "addTaskMobile.html");

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html"),
        includeHtml("add-task-content-mobile", "addTaskContentMobile.html")
    ]);

    document.querySelector('header').classList.add('add-task-header-mobile');
    await fillMobileHtmlWithContent();
}

/**
 * Clears the current HTML body content.
 * This is used before loading new HTML components for the Add Task view.
 */
function clearAddTaskHtmlBody() {
    document.querySelector('body').innerHTML = "";
}

/** Fills the HTML with content for the Add Task view.
 * Initializes the TaskElements class and populates the left and right containers.
 * Sets up the form submission function and button click handlers.
 * @returns {Promise<void>}
 */
async function fillHtmlWithContent() {
    const taskElements = new TaskElements("addTasktaskComponents");
    taskElements.fillLeftContainerOnAddTask();
    taskElements.fillRightContainerOnAddTask();
    addTaskUtils.setAddTaskFormSubmitFunction("addTasktaskComponents", false);
    addTaskUtils.setAddTaskCreateBtnMouseFunction('createTaskButton', 'addTasktaskComponents');
}

/**
 * Fills the mobile HTML with content for the Add Task view.
 * Initializes the AddTaskMobileUtil class and renders the mobile components.
 * Sets up the form submission function.
 * @returns {Promise<void>}
 */
async function fillMobileHtmlWithContent() {
    const taskMobileUtil = new AddTaskMobileUtil("addTasktaskComponents");
    await taskMobileUtil.startRenderAddTaskMobile();
    addTaskUtils.setAddTaskFormSubmitFunction("addTasktaskComponents", false);
    addTaskUtils.setAddTaskCreateBtnMouseFunction('createTaskButton', 'addTasktaskComponents');
}


/**
 * Changes the Add Task view to standard (non-dialog) mode by adjusting classes and attributes.
 */
function changeAddTaskViewToStandard() {
    document.getElementById('a-t-dialog-close-btn').classList.add('display-hidden');
    document.getElementById('a-t-cancel-btn').classList.add('display-hidden');
    document.getElementById('a-t-clear-btn').classList.remove('display-hidden');
    document.getElementById('add-task-form').classList.add('add-task-form-desktop');
    document.getElementById('add-task-form').classList.remove('add-task-form-dialog');
    document.getElementById('a-t-middle-container').classList.remove('a-t-f-i-midle-dialog');
    document.querySelector('body').setAttribute("onmouseup", "addTasktaskComponents.addTaskWindowMouseClick(event)");
}


/**
 * Loads necessary data for the Add Task view, including contacts and categories.
 */
async function loadDataForAddTask() {
    renderUserInitial();
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();

    if (!addTasktaskComponents) {
        addTasktaskComponents = new TaskComponents(currentUser, "addTasktaskComponents");
        await addTasktaskComponents.run();
        window.addTasktaskComponents = addTasktaskComponents;
    }

    AddTaskUtils.applyAddTaskDataToView(addTasktaskComponents);

}










