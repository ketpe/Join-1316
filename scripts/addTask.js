
let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();
let addTasktaskComponents = null;
let currentView = ""; //ich meine hier Desktop oder Mobile
const minDesktopHeight = 880;
const minDesktopWidth = 1180;

//TODO - Die aktuellen Werte zwischenspeichern, damit wenn die Seite von mobile zu Desktop verschoben oder umgekehrt, diese nicht verschwinden!

/**
 * Initializes the Add Task view by rendering necessary components and loading data.
 */
async function onLoadAddTask() {
    const [height, width] = getCurrentAddTaskSize();

    if(height >= minDesktopHeight && width >= minDesktopWidth){
        await loadHtmlComponentsForDesktop();
        changeAddTaskViewToStandard();
        changeAddTaskFieldSize(height, width);
    }else{
        await loadHtmlComponentsForMobile();
        changeAddTaskFieldSize(height, width);
    }
   
    
    await loadDataForAddTask();
    
}


async function addTaskPageResize(){

    const [height, width] = getCurrentAddTaskSize();
    if((height <= minDesktopHeight || width <= minDesktopWidth) && currentView != "mobile"){
        await loadHtmlComponentsForMobile();
        location.reload();
        
    }else if(height >= minDesktopHeight + 1 && width >= minDesktopWidth + 1 && currentView != "desktop"){
        await loadHtmlComponentsForDesktop();
        location.reload();
    }
  
}

function getCurrentAddTaskSize(){
    return [height, width] = [window.innerHeight, window.innerWidth];
}


async function loadHtmlComponentsForDesktop() {
    currentView = "desktop";
    clearAddTaskHtmlBody();
    await Promise.all([
        includeHtmlForNode("body", "addTaskDesktop.html")
    ]);

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),
        includeHtml("add-task-content", "addTaskContent.html")
    ]);
   
    await fillHtmlWithContent();
}

async function loadHtmlComponentsForMobile() {
    currentView = "mobile"
    clearAddTaskHtmlBody();

    await Promise.all([
        includeHtmlForNode("body", "addTaskMobile.html")
    ]);

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
    const taskMobileUtil = new AddTaskMobileUtil();
    await taskMobileUtil.startRenderAddTaskMobile();
}


function changeAddTaskFieldSize(height, width){
    if(currentView == "desktop"){
        const dHeightForFields = addTaskUtils.measureTheRemainingSpaceOfFieldsForDesktop(height);
        document.querySelector(".add-task-fields").style.height = dHeightForFields + "px";
    }else if(currentView == "mobile"){
        const dHeightForFieldsMobile = addTaskUtils.measureTheRemainingSpaceOfFieldsForMobile(height);
        document.querySelector(".add-task-mobile-fields").style.height = dHeightForFieldsMobile + "px";
    }
}




function setAddTaskFormSubmitFunction(){
    const form = document.getElementById('add-task-form');
    if(!form){return;}
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
    addTasktaskComponents = new TaskComponents(currentUser, "addTasktaskComponents");
    addTasktaskComponents.run();
}










