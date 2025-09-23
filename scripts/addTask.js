
let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();
let addTasktaskComponents = null;


/**
 * Initializes the Add Task view by rendering necessary components and loading data.
 */
async function onLoadAddTask() {
    await renderAddTaskWithNavAndHeader();
    changeAddTaskViewToStandard();
    await loadDataForAddTask();
}

/**
 * Render the Add Task view along with the navigation bar and header.
 */
async function renderAddTaskWithNavAndHeader() {

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),
        includeHtml("add-task-content", "addTask.html")
    ]);
    const taskElements = new TaskElements("addTasktaskComponents");
    taskElements.fillLeftContainerOnAddTask();
    taskElements.fillRightContainerOnAddTask();
    setAddTaskFormSubmitFunction();
    setAddTaskCreateBtnMouseFunction();
}

function setAddTaskFormSubmitFunction(){
    const form = document.getElementById('add-task-form');
    if(!form){return;}
    form.setAttribute('onsubmit', "return addTasktaskComponents.addTaskCreateTask(event)");
}

function setAddTaskCreateBtnMouseFunction(){
    const btn = document.getElementById('createTaskButton');
    if(!btn){return;}
    btn.setAttribute('onmouseover', `addTasktaskComponents.addTaskSubmitOnMouse(this)`);
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
    document.getElementsByTagName('body')[0].setAttribute("onmouseup", "addTasktaskComponents.addTaskWindowMouseClick(event)");
}


/**
 * Loads necessary data for the Add Task view, including contacts and categories.
 */
async function loadDataForAddTask() {
    renderUserInitial();
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
    addTasktaskComponents = new TaskComponents(currentUser, "addTasktaskComponents");
    addTasktaskComponents.run();
}










