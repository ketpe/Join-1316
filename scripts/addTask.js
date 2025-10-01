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
let currentView = ""; //ich meine hier Desktop oder Mobile
let resizeLock = false;


//TODO - Die aktuellen Werte zwischenspeichern, damit wenn die Seite von mobile zu Desktop verschoben oder umgekehrt, diese nicht verschwinden!


//TODO - Berechnung!
/**
 * Initializes the Add Task view by rendering necessary components and loading data.
 */
async function onLoadAddTask() {
    const [height, width] = getCurrentAddTaskSize();

    if (width >= breakPointToDesktopSingle) {
        await changeAddTaskToDesktop(height, width);
    } else if (width < breakPointToDesktopSingle && width > breakPointToMobile) {
        await changeAddTaskToDesktopSingle(height, width);
    } else {
        await changeAddTaskToMobile(height, width);
    }

    changeAddTaskFormFieldSize(height, width, currentView);
}


async function addTaskPageResize() {

    if (resizeLock) { return; }
    resizeLock = true;

    try {
        const [height, width] = getCurrentAddTaskSize();
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

async function changeAddTaskToDesktop() {
    currentView = DESKTOP;
    await loadHtmlComponentsForDesktop();
    changeAddTaskViewToStandard();
    await loadDataForAddTask();

}

async function changeAddTaskToDesktopSingle() {
    currentView = DESKTOPSINGLE;
    await loadHtmlComponentsForDesktopSingle();
    await loadDataForAddTask();

}

async function changeAddTaskToMobile() {
    currentView = MOBILE;
    await loadHtmlComponentsForMobile();
    await loadDataForAddTask();

}

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

function getCurrentAddTaskSize() {
    return [window.innerHeight, window.innerWidth];
}


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

async function loadHtmlComponentsForMobile() {
    clearAddTaskHtmlBody();

    await includeHtmlForNode("body", "addTaskMobile.html")

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobil.html"),
        includeHtml("add-task-content-mobile", "addTaskContentMobile.html")
    ]);

    await fillMobileHtmlWithContent();
}


function clearAddTaskHtmlBody() {
    document.querySelector('body').innerHTML = "";
}

async function fillHtmlWithContent() {
    const taskElements = new TaskElements("addTasktaskComponents");
    taskElements.fillLeftContainerOnAddTask();
    taskElements.fillRightContainerOnAddTask();
    setAddTaskFormSubmitFunction();
    addTaskUtils.setAddTaskCreateBtnMouseFunction('createTaskButton', 'addTasktaskComponents');
}

async function fillMobileHtmlWithContent() {
    const taskMobileUtil = new AddTaskMobileUtil("addTasktaskComponents");
    await taskMobileUtil.startRenderAddTaskMobile();
}


function setAddTaskFormSubmitFunction() {
    const form = document.getElementById('add-task-form');
    if (!form) { return; }
    form.setAttribute('onsubmit', "return addTasktaskComponents.addTaskCreateTask(event)");
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

    if (!addTasktaskComponents) {
        addTasktaskComponents = new TaskComponents(currentUser, "addTasktaskComponents");
        await addTasktaskComponents.run();
        window.addTasktaskComponents = addTasktaskComponents;
    }

    AddTaskUtils.applyAddTaskDataToView(addTasktaskComponents);

}










