let currentDueDate = "";
let cuurentTitle = "";
let contactAllListFromDB = [];


async function onLoadAddTask() {
    await renderAddTaskWithNavAndHeader();
    changeAddTaskViewToStandard()
    await loadDataForAddTaskViewAndRenderView();
}


async function renderAddTaskWithNavAndHeader() {

    await Promise.all([
        includeHtml("navbar", "navbar-desktop.html"),
        includeHtml("header", "header-desktop.html"),
        includeHtml("add-task-content", "add-task.html")
    ]);

}


function changeAddTaskViewToStandard() {
    document.getElementById('a-t-dialog-close-btn').classList.add('display-hidden');
    document.getElementById('a-t-cancel-btn').classList.add('display-hidden');
    document.getElementById('a-t-clear-btn').classList.remove('display-hidden');
    document.getElementById('add-task-form').classList.add('add-task-form-desktop');
    document.getElementById('add-task-form').classList.remove('add-task-form-dialog');
    document.getElementById('a-t-middle-container').classList.remove('a-t-f-i-midle-dialog');
}



async function loadDataForAddTaskViewAndRenderView(){
    //await loadContactsAllFomDB();
    //renderContactOptions(contactAllListFromDB);
    
}

function renderContactOptions(contactList) {
    let contactSelectElement = document.getElementById('task-assign-to');

    contactSelectElement.innerHTML += "<option value=''>Select contacts to assign</option>"

    for(let i = 0; i < contactList.length; i++){
        contactSelectElement.innerHTML += addTaskContactOption(contactList[i]);
    }
}

async function loadContactsAllFomDB() {
    contactAllListFromDB = await getSortedContact()
}


function dateFieldOnChange() {
    startDueDateValidation();
}

function onDateIconClick() {
    let datePicker = document.getElementById('due-date-hidden');
    datePicker.showPicker();
}

function datePickerSelectionChange(e) {
    let newDateArr = String(e.target.value).split('-');
    let newDateString = `${newDateArr[2]}/${newDateArr[1]}/${newDateArr[0]}`;
    document.getElementById('due-date-display').value = newDateString;
    dateFieldOnChange();

}


function addTaskTitleOnInput() {
    let titleValue = document.getElementById('task-title');

    if(!titleValue.value){
        showAndLeaveErrorMessage("a-t-title-required", true);
        showAndLeaveErrorBorder("task-title", true);
    }else {
        taskTitleValidation(titleValue.value);
    }
}


function taskTitleValidation(titleValue) {
    const cleanTitleValue = (titleValue ?? "").trim();
    
    if(cleanTitleValue.length > 3){
        showAndLeaveErrorMessage("a-t-title-required", false);
        showAndLeaveErrorBorder("task-title", false);
    }else{
        showAndLeaveErrorMessage("a-t-title-required", true);
        showAndLeaveErrorBorder("task-title", true);
    }
}

function showAndLeaveErrorMessage(messageTarget, visibilty = true) {
    let errorField = document.getElementById(messageTarget);
    if (errorField == null) { return; }
    if (visibilty) {
        errorField.classList.remove("error-text-hidden");
        errorField.classList.add('error-text-show');
    } else {
        errorField.classList.add("error-text-hidden");
        errorField.classList.remove('error-text-show');
    }
}

function showAndLeaveErrorBorder(inputTarget, visibilty = true) {
    let inputField = document.getElementById(inputTarget);
    if (inputField == null) { return; }
    if (visibilty) {
        inputField.classList.add('input-has-error');
    } else {
        inputField.classList.remove('input-has-error');
    }
}


function showContactListForSelect(){
    const contactListContainer = document.getElementById('contact-List-container');
    const contactList = document.getElementById('contact-List-for-task');
    
    //contactListContainer.style.height = contactList.scrollHeight + "px";
    //contactList.style.height = contactList.scrollHeight + "px";

    contactListContainer.style.height = "100px";
    contactList.style.height = "80px";
}


function hideContactListForSelect() {
    const contactListContainer = document.getElementById('contact-List-container');
    const contactList = document.getElementById('contact-List-for-task');

    contactListContainer.style.height = "100px";
    contactList.style.height = "80px";

    requestAnimationFrame(() => {
        contactListContainer.style.height = "0";
        contactList.style.height = "0";
    });

}









