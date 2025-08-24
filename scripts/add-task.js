let currentDueDate = "";
let cuurentTitle = "";
let contactAllListFromDB = [];
let isContactListOpen = false;


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
    document.getElementsByTagName('body')[0].setAttribute("onmouseup", "addTaskWindowMouseClick(event)");
}



async function loadDataForAddTaskViewAndRenderView() {
    await loadContactsAllFomDB();


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

    if (!titleValue.value) {
        showAndLeaveErrorMessage("a-t-title-required", true);
        showAndLeaveErrorBorder("task-title", true);
    } else {
        taskTitleValidation(titleValue.value);
    }
}


function taskTitleValidation(titleValue) {
    const cleanTitleValue = (titleValue ?? "").trim();

    if (cleanTitleValue.length > 3) {
        showAndLeaveErrorMessage("a-t-title-required", false);
        showAndLeaveErrorBorder("task-title", false);
    } else {
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



function showAndHideContacts(showOrHide = "show") {
    const buttonShowOhrHide = document.getElementById('show-and-hide-contacts');
    buttonShowOhrHide.setAttribute('onclick', (showOrHide == "show" ? 'showAndHideContacts("hide")' : 'showAndHideContacts("show")'));
    const inputField = document.getElementById('task-assign-to');
    if (showOrHide == "show") {
        inputField.value = "";
        inputField.focus();
        showContactListForSelect();
        renderHideContactsIcon();
    } else {
        inputField.value = "Select contacts to assign";
        hideContactListForSelect();
        renderShowContactsIcon();
    }
}


function renderShowContactsIcon() {
    const iconDiv = document.getElementById('show-or-hide-icon');
    iconDiv.classList.remove('icon-hide-contacts');
    iconDiv.classList.add('icon-show-contacts');
}

function renderHideContactsIcon() {
    const iconDiv = document.getElementById('show-or-hide-icon');
    iconDiv.classList.add('icon-hide-contacts');
    iconDiv.classList.remove('icon-show-contacts');
}


function showContactListForSelect(currentContactList = []) {

    const contactListArray = currentContactList.length !== 0 ? currentContactList : contactAllListFromDB;
    if (contactListArray == null || contactListArray.length == 0) { return; }
    renderContactOptions(contactListArray);
    const contactListContainer = document.getElementById('contact-List-container');
    const contactList = document.getElementById('contact-List-for-task');
    const heightOfOneContact = document.getElementById(contactListArray[0]['id']).offsetHeight;
    let heightOfContainer = (contactListArray.length <= 5 ? heightOfOneContact * contactListArray.length : heightOfOneContact * 5) + 40;
    contactListContainer.style.height = heightOfContainer + "px";
    contactList.style.height = (heightOfContainer - 27) + "px";
    isContactListOpen = true;
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

    contactList.innerHTML = "";
    isContactListOpen = false;
}

function renderContactOptions(contactList) {
    let contactSelectElement = document.getElementById('contact-List-for-task');
    contactSelectElement.innerHTML = "";

    for (let i = 0; i < contactList.length; i++) {
        contactSelectElement.innerHTML += getContactListElement(contactList[i]);
    }
}


function contactButtonOnListSelect(currentContactBtn) {

    const contactID = currentContactBtn.getAttribute('id');

    if (!checkIfContactAvailable(contactID)) { return; }

    const contactState = currentContactBtn.getAttribute('active');

    if (contactState == "true") {
        checkOutContact(currentContactBtn, contactID);
    } else {
        checkInContact(currentContactBtn, contactID);
    }

    document.getElementById('contact-List-for-task').focus();

}

function checkIfContactAvailable(currentContact) {
    return true;
}

function checkInContact(currentContact, contactID) {
    contactAddToTask(contactID);
    currentContact.classList.add('contact-selected');
    const elementName = currentContact.querySelector(`.contact-profil-container p`);
    elementName.classList.add('white');
    const elementCheck = currentContact.querySelector(`.contact-check-icon`);
    elementCheck.classList.remove('contact-unchecked');
    elementCheck.classList.add('contact-checked');
    currentContact.setAttribute('active', 'true');
}

function checkOutContact(currentContact, contactID) {
    contactRemoveFromTask(contactID);
    currentContact.classList.remove('contact-selected');
    const elementName = currentContact.querySelector(`.contact-profil-container p`);
    elementName.classList.remove('white');
    const elementCheck = currentContact.querySelector(`.contact-check-icon`);
    elementCheck.classList.add('contact-unchecked');
    elementCheck.classList.remove('contact-checked');
    currentContact.setAttribute('active', 'false');
}

function contactAddToTask(currentContact) {

}

function contactRemoveFromTask(currentContact) {

}

function addTaskWindowMouseClick(e) {
    const contactInputField = document.getElementById('task-assign-to');
    const profileContainer =  filterElementsBySelector(".contact-profil-container", e.target);
    const profileContainerP = filterElementsBySelector(".contact-profil-container > p", e.target);
    const contacList = document.getElementById('contact-List-for-task');
    const contactlistContainer = document.getElementById('contact-List-container');
    const buttonsSelect = filterElementsBySelector('.contact-list-btn', e.target);
    const iconsSelect = filterElementsBySelector('.contact-check-icon', e.target);
    const showAndHideIcon = document.getElementById('show-or-hide-icon');
    const showAndHideButton = document.getElementById('show-and-hide-contacts');
    const profileContainerSpans = filterElementsBySelector('.contact-profil-container > div > span', e.target);
    const elipse = filterElementsBySelector('.contact-ellipse', e.target);
    const contactSelectContainer = filterElementsBySelector('.contact-select-container', e.target);

   

    if(e.target != contactInputField && 
        e.target != showAndHideButton &&
        !profileContainer &&
        e.target != contacList &&
        e.target != contactlistContainer &&
        e.target != showAndHideIcon &&
        !profileContainerP &&
        isContactListOpen && !buttonsSelect && !iconsSelect && !profileContainerSpans && !elipse && !contactSelectContainer
    ){
        showAndHideContacts("hide");
       
    }

}

function filterElementsBySelector(selector, target) {
    const elements = document.querySelectorAll(selector);
    let BreakException = {};
    try {
        elements.forEach((e) => {
        if(e == target){
            throw BreakException;
        }
    });
    } catch (e) {
        if(e == BreakException){
            return true;
        }
    }

    return false;

}
