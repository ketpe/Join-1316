/**
 * @fileoverview
 * @namespace board
 * @description This script manages the Kanban board functionality, including loading components, fetching tasks from the database, rendering tasks, handling responsive design, and managing task interactions.
 * It includes functions for loading HTML components based on screen size, retrieving and processing task data, rendering tasks on the board, and handling user interactions such as searching and editing tasks.
 */
let boardTaskComponents = null;
let currentView = "";
const minDesktopHeight = 880;
const minDesktopWidth = 880;
const breakPointToDesktopSingle = 1180;

/**
 * @function onLoadBoard
 * @memberof board
 * @description Initializes the Kanban board by checking user login status, determining the current board size, and loading appropriate HTML components for desktop or mobile view.
 * @returns {Promise<void>}
 */
async function onLoadBoard() {
    checkUserOrGuestIsloggedIn();
    const [height, width] = getCurrentWindowSize();
    const head = document.getElementsByTagName('head');
    if (width >= minDesktopWidth) {
        await loadHtmlComponentsForDesktop(height);
        setNavigationButtonActive('board', "desktop");
        kanbanUpdateSizeDesktop();
    } else {
        await loadHtmlComponentsForMobile(height);
        setNavigationButtonActive('board', "mobile");
        kanbanUpdateSizeMobile();
    }
    window.addEventListener('resize', onBoardPageResize);
    window.addEventListener('resize', updateLandscapeBlock);

}

/**
 * @function loadHtmlComponentsForDesktop
 * @memberof board
 * @description Loads HTML components for the desktop view of the Kanban board.
 * It clears the existing HTML body, includes necessary HTML files for the desktop layout, shows a loading animation, fetches and renders board tasks, and then hides the loading animation.
 * @param {HTMLCollection} head - The head element of the document.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForDesktop(height) {
    currentView = "desktop";
    clearBoardHtmlBody();
    await includeHtmlForNode("body", "boardDesktop.html");
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),
    ]);
    showLoadingAnimation();
    await getBoardTasks();
    renderUserInitial();
    hideLoadingAnimation();
    clampBoardTaskTitles();
}

/**
 * @function loadHtmlComponentsForMobile
 * @memberof board
 * @description Loads HTML components for the mobile view of the Kanban board.
 * It clears the existing HTML body, includes necessary HTML files for the mobile layout, shows a loading animation, fetches and renders board tasks, and then hides the loading animation.
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForMobile(height) {
    currentView = "mobile"
    clearBoardHtmlBody();
    await includeHtmlForNode("body", "boardMobile.html");

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html"),
    ]);
    showLoadingAnimation();
    await getBoardTasks();
    renderUserInitial();
    hideLoadingAnimation();
    clampBoardTaskTitles();
}

/**
 * @function getBoardTaskWithLoadingAnimation
 * @memberof board
 * @description Fetches board tasks with a loading animation.
 * @returns {Promise<void>}
 */
async function getBoardTaskWithLoadingAnimation() {
    showLoadingAnimation();
    await getBoardTasks();
    hideLoadingAnimation();
    clampBoardTaskTitles();
}

/**
 * @function clearBoardHtmlBody
 * @memberof board
 * @description Clears the content of the board HTML body.
 * @returns {void}
 */
function clearBoardHtmlBody() {
    document.querySelector('body').innerHTML = "";
}

/**
 * @function onBoardPageResize
 * @memberof board
 * @description Adjusts the Kanban board layout based on the current window size, loading either mobile or desktop components as needed.
 * @returns {Promise<void>}
 */
async function onBoardPageResize() {
    const [height, width] = getCurrentWindowSize();
    if ((width <= minDesktopWidth) && currentView != "mobile") {
        checkIfAddTaskDialogOpen();
        await loadHtmlComponentsForMobile();
        setNavigationButtonActive('board', "mobile");
    } else if (width >= minDesktopWidth + 1 && currentView != "desktop") {
        await loadHtmlComponentsForDesktop();
        setNavigationButtonActive('board', "desktop");
    }
    currentView === "desktop" ? kanbanUpdateSizeDesktop() : kanbanUpdateSizeMobile();
    setTaskViewEditDialogSize();
}

/**
 * @function checkIfAddTaskDialogOpen
 * @memberof board
 * @description Checks if the add task dialog is open and navigates to it if necessary.
 * @returns {void}
 */
function checkIfAddTaskDialogOpen() {
    const addTaskDialog = document.querySelector('#add-task-dialog.dialog-show');
    if (!addTaskDialog) { return; }
    navigateToAddTask(null, currentStateCategory);
}

















