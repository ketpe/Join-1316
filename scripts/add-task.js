let currentDueDate = "";
let currentTitle = "";
let contactAllListFromDB = [];
let isContactListOpen = false;
let currentContactAssignList = [];
let currentPriority = "";
let categories = [];
let isCategoryListOpen = false;
let currentCategory = {};
let currentSubTasks = [];
let currentUser = "";
let isGuest = false;
let addTaskUtils = new AddTaskUtils();

async function onLoadAddTask() {
    await renderAddTaskWithNavAndHeader();
    changeAddTaskViewToStandard();
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


//NOTE - Startfunktion 1. Kontakte laden
async function loadDataForAddTaskViewAndRenderView(fromDialog = false) {
    await loadContactsAllFomDB();
    await loadCategoriesFromDB();
    setNewPriority("Medium");
    fromDialog == false ? renderUserInitial() : "";
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
}

//NOTE - Lade alle Kontakte aus der DB in das Array
async function loadContactsAllFomDB() {
    contactAllListFromDB = await getSortedContact()
}


async function loadCategoriesFromDB() {
    categories = await getAllData("categories");
}

//NOTE - Generische Funktion zum Anzeigen / Ausblenden der Errormeldung
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

//NOTE - Generische Funktion zum Anzeigen / Ausblenden des Fehlerrahmens
function showAndLeaveErrorBorder(inputTarget, visibilty = true) {
    let inputField = document.getElementById(inputTarget);
    if (inputField == null) { return; }
    if (visibilty) {
        inputField.classList.add('input-has-error');
    } else {
        inputField.classList.remove('input-has-error');
    }
}

//NOTE - Diese Funktion wurde dem Body inzugefügt, um die Mausklicks abzufangen. Wenn die Liste offen ist und ein anders Elemet
// Ausser den hier angegebenen geklickt wird, schliesst sich das Fenster, wie beim Klick auf den Pfeil nach oben.
function addTaskWindowMouseClick(e) {

    if (!e.target.closest(".contact-select-container") && !e.target.closest(".contact-List-container") && isContactListOpen) {
        showAndHideContacts("hide");
    }

    if (!e.target.closest('.category-select-container') && !e.target.closest('.category-list-container') && isCategoryListOpen) {
        showAndHideCategories('hide');
    }
}

function addTaskCheckRequiredField() {

    let createButton = document.getElementById('createTaskButton');

    createButton.disabled =
        currentDueDate.length > 0 &&
            currentTitle.length > 0 &&
            currentPriority.length > 0 &&
            currentCategory.hasOwnProperty("title") ? false : true;

}

function addTaskSubmitOnMouse() {
    document.getElementById('task-title').blur();
    document.getElementById('due-date-display').blur();
    addTaskCheckRequiredField();

}


//NOTE - Inputfeld -> Titel -> es wurde eine Inputänderung erkannt
function addTaskTitleOnInput() {
    let titleValue = document.getElementById('task-title');

    if (!titleValue.value) {
        showAndLeaveErrorMessage("a-t-title-required", true);
        showAndLeaveErrorBorder("task-title", true);
    } else {
        taskTitleValidation(titleValue.value);
    }
}

//NOTE - Validierung des Titels
function taskTitleValidation(titleValue = "") {
    const cleanTitleValue = (titleValue ?? "").trim();

    if (cleanTitleValue.length > 3) {
        showAndLeaveErrorMessage("a-t-title-required", false);
        showAndLeaveErrorBorder("task-title", false);
        currentTitle = cleanTitleValue;
    } else {
        showAndLeaveErrorMessage("a-t-title-required", true);
        showAndLeaveErrorBorder("task-title", true);
        currentTitle = "";
    }

}

//NOTE - Hier hat sich das Datumsfeld geändert
function dateFieldOnChange() {
    startDueDateValidation();
}

//NOTE - Der "Datepicker" wurde geklickt
function onDateIconClick() {
    let datePicker = document.getElementById('due-date-hidden');
    datePicker.showPicker();
}

//NOTE - Das Datum aus dem Picker hat sich geändert
function datePickerSelectionChange(e) {
    let newDateArr = String(e.target.value).split('-');
    let newDateString = `${newDateArr[2]}/${newDateArr[1]}/${newDateArr[0]}`;
    document.getElementById('due-date-display').value = newDateString;
    dateFieldOnChange();
}


//SECTION - Auswahl Prio
//NOTE - Ein Button wurde in der UI ausgewählt. Jenachdem ob dieser schon aktiv war oder nicht.
// Werden alle resettet oder dieser wird auf aktiv gesetzt.
function addTaskPrioritySelect(button) {
    if (!button) { return; }

    const buttonName = button.getAttribute('name');
    const isActiv = button.getAttribute('data-selected') == "true";

    if (currentPriority == buttonName && isActiv) {
        allPriortyButtonsReset();
    } else {
        setNewPriority(buttonName);
    }

}

//NOTE - Alle Prio-buttons werden auf inActiv gesetzt.
function allPriortyButtonsReset() {
    currentPriority = "";
    const btnContainer = document.getElementById('task-priority-button');
    const buttons = btnContainer.querySelectorAll('.btn');

    buttons.forEach((b) => {
        b.setAttribute('data-selected', 'false');
        setButtonSytleNotActiv(b);
    });
}

//NOTE - Eine andere Prioität wurde gewählt.
// Dieser Button wird aktiv geschaltet und entsprechend gestylt. Alle anderen werden inaktiv gesetzt.
function setNewPriority(priority) {
    const btnContainer = document.getElementById('task-priority-button');
    const buttons = btnContainer.querySelectorAll('.btn');

    buttons.forEach((b) => {

        if (b.getAttribute('name') == priority) {
            b.setAttribute('data-selected', 'true');
            setButtonStyleActiv(b);

        } else {
            b.setAttribute('data-selected', 'false');
            setButtonSytleNotActiv(b);
        }

    });

    currentPriority = priority;

}

//NOTE - Einen Button auf ACTIV schalten -> dieser ist ausgewählt
function setButtonStyleActiv(button) {
    if (!button) { return; }
    button.classList.add(`prio-${button.getAttribute('data-name')}-selected`);
    togglePrioButtonTextColor(button, "white");
}

//NOTE - Einen Button auf NICHT-ACTIV schalten -> dieser ist nicht ausgewählt
function setButtonSytleNotActiv(button) {
    if (!button) { return; }
    button.classList.remove(`prio-${button.getAttribute('data-name')}-selected`);
    togglePrioButtonTextColor(button, "black");
}

//NOTE - Die Farbe des Textes in dem Button entsprechend umschalten
function togglePrioButtonTextColor(button, whiteOrBlack) {
    if (!button) { return; }
    let btnText = button.querySelector('p');
    if (whiteOrBlack == "white") {
        btnText.classList.add('prio-selected');
    } else {
        btnText.classList.remove('prio-selected');
    }

}
//!SECTION Ende der Prio - Auswahl



//NOTE - Diese Funktion wird duch einen Button in der UI im Inputfeld der Kontaktauswahl aufgerufen
//  Bei der Übergabe des Parameters wird entschieden was zu tun ist
function showAndHideContacts(showOrHide = "show") {
    const buttonShowOhrHide = document.getElementById('show-and-hide-contacts');
    buttonShowOhrHide.setAttribute('onclick', (showOrHide == "show" ? 'showAndHideContacts("hide")' : 'showAndHideContacts("show")'));
    const inputField = document.getElementById('task-assign-to');
    if (showOrHide == "show") {
        inputField.value = "";
        inputField.focus();
        showContactListForSelect();
        renderHideIcon('show-hide-icon-contacts');
        showOrHideBadgeContainer("hide");
    } else {
        inputField.value = "Select contacts to assign";
        hideContactListForSelect();
        renderShowIcon('show-hide-icon-contacts');
        showOrHideBadgeContainer("show");
    }
}


//NOTE - Anzeigen des Pfeil nach unten -> Show
function renderShowIcon(elementID) {
    const iconDiv = document.getElementById(elementID);
    if (!iconDiv) { return; }
    iconDiv.classList.remove('icon-hide-list');
    iconDiv.classList.add('icon-show-list');
}

//NOTE - Anzeigen des Pfeils nach oben -> Hide
function renderHideIcon(elementID) {
    const iconDiv = document.getElementById(elementID);
    if (!iconDiv) { return; }
    iconDiv.classList.add('icon-hide-list');
    iconDiv.classList.remove('icon-show-list');
}

//NOTE - Kontaktlist zum rendern erstellen.
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


//NOTE - Das Kontaktauswahlfenster schliessen -> Sonderfunktion erkären!
function hideContactListForSelect() {
    const contactListContainer = document.getElementById('contact-List-container');
    const contactList = document.getElementById('contact-List-for-task');

    requestAnimationFrame(() => {
        contactListContainer.style.height = "0";
        contactList.style.height = "0";
    });

    contactList.innerHTML = "";
    isContactListOpen = false;
}

//NOTE - Render der Kontaktliste. Prüfen, ob der Kontakt bereits zugefügt wurde -> Anzeige entsprechend ändern
function renderContactOptions(contactList) {
    let contactSelectElement = document.getElementById('contact-List-for-task');
    contactSelectElement.innerHTML = "";

    for (let i = 0; i < contactList.length; i++) {
        const currentContactAssigned = addTaskUtils.findContactInAssignList(contactList[i], currentContactAssignList);
        contactSelectElement.innerHTML += getContactListElement(contactList[i], currentContactAssigned);
    }
}

//NOTE - Hinzufügen oder löschen aus der Assigned Liste, jenachdem ob das Attibut "active" true oder nicht gesetzt ist.
function contactButtonOnListSelect(currentContactBtn) {

    const contactID = currentContactBtn.getAttribute('id');
    if (!addTaskUtils.checkIfContactAvailable(contactID, contactAllListFromDB)) { return; }

    currentContactBtn.getAttribute('data-active') == "true" ?
        checkOutContact(currentContactBtn, contactID) : checkInContact(currentContactBtn, contactID);

}

//NOTE - Den Kontakt der Liste zuführen und Styling anpassen.
function checkInContact(currentContact, contactID) {
    currentContactAssignList = addTaskUtils.contactAddToTask(contactID, contactAllListFromDB, currentContactAssignList);
    currentContact.classList.add('contact-selected');
    const elementName = currentContact.querySelector(`.contact-profil-container p`);
    elementName.classList.add('white');
    const elementCheck = currentContact.querySelector(`.contact-check-icon`);
    elementCheck.classList.remove('contact-unchecked');
    elementCheck.classList.add('contact-checked');
    currentContact.setAttribute('data-active', 'true');
}

//NOTE - Den Kontakt aus der Liste entfernen und Styling anpassen.
function checkOutContact(currentContact, contactID) {
    currentContactAssignList = addTaskUtils.contactRemoveFromTask(contactID, currentContactAssignList);
    currentContact.classList.remove('contact-selected');
    const elementName = currentContact.querySelector(`.contact-profil-container p`);
    elementName.classList.remove('white');
    const elementCheck = currentContact.querySelector(`.contact-check-icon`);
    elementCheck.classList.add('contact-unchecked');
    elementCheck.classList.remove('contact-checked');
    currentContact.setAttribute('data-active', 'false');
}


//NOTE - Contacte nach der Eingabe filtern und anzeigen
function filterContactFromInputValue(inputValue) {
    showContactListForSelect(addTaskUtils.filterContacts(inputValue, contactAllListFromDB));
}


//NOTE - Contactbadges anzeigen oder nicht
function showOrHideBadgeContainer(showOrHide = "") {
    if (showOrHide.length == 0) { return; }
    let container = document.getElementById('contact-assigned-badge');
    if (showOrHide == "show") {
        container.classList.remove('d-none');
        renderAsignedProfilBadge();
    } else {
        container.classList.add('d-none');
        container.innerHTML = "";
    }
}

//NOTE - Die Profilicons der Contactauswahl anzeigen.
//Es werden nur 4 Badges angezeigt.
function renderAsignedProfilBadge() {
    if (currentContactAssignList.length == 0) {
        return;
    }

    let badgeContainer = document.getElementById('contact-assigned-badge');
    badgeContainer.innerHTML = "";
    let counter = 0;
    for (let i = 0; i < currentContactAssignList.length; i++) {
        badgeContainer.innerHTML += getAssignedContactBadge(currentContactAssignList[i]);
        counter++;
        if (counter == 4) { break; }
    }
}



//SECTION Categie Auswahl
//NOTE - Funktionsaufruf vom Button in Inputfeld
function showAndHideCategories(showOrHide = "show") {
    if (showOrHide == "show") {
        showCategoryListForSelect();
        setCategoryShowOrHideButton(showOrHide);
        renderHideIcon('show-hide-icon-category');
    } else {
        hideCategoryListForSelect();
        checkCategoryInputValue();
    }
}

//NOTE - die Auswahlliste der Categirien anzeigen
//Die Categorien rendern lassen
//Die Höhe eines Elementes berechnen
//Daraus die resultierende Höhe den Container und der Liste zuweisen
//Inputfeld -> Text ändern
//Aktuelle Categorie leeren
function showCategoryListForSelect() {
    if (categories == null || categories.length == 0) { return; }
    renderCategoryOptions(categories);
    const categoryListContainer = document.getElementById('category-list-container');
    const categoryList = document.getElementById('category-list-for-task');
    const heightOfOneCategory = document.getElementById(categories[0]['id']).offsetHeight;
    let heightOfContainer = heightOfOneCategory * categories.length + 40;
    categoryListContainer.style.height = heightOfContainer + "px";
    categoryList.style.height = (heightOfContainer - 27) + "px";
    setCategoryInputfieldValue('Select task category');
    currentCategory = {};
    isCategoryListOpen = true;
}

//NOTE - die Auswahlliste wieder einklappen.
//Den Button ändern und das Icon anpassen
function hideCategoryListForSelect() {
    const categoryListContainer = document.getElementById('category-list-container');
    const categoryList = document.getElementById('category-list-for-task');

    requestAnimationFrame(() => {
        categoryListContainer.style.height = "0";
        categoryList.style.height = "0";
    });

    categoryList.innerHTML = "";
    setCategoryShowOrHideButton('hide');
    renderShowIcon('show-hide-icon-category');
    isCategoryListOpen = false;
}

//NOTE - Die Categorien in der Liste anueigen
function renderCategoryOptions(categories) {
    let categorySelectElement = document.getElementById('category-list-for-task');
    categorySelectElement.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        categorySelectElement.innerHTML += getCategoryListElement(categories[i]);
    }
}

//NOTE - Eine Categorie wurde gewählt.
//Den Index der Categorie bestimmen
//Die Aktuelle Categorie setzen
//Die Auswahlliste schiessen
//Den Titel in das Inputfeld schreiben
//Den Check durchführen
function categoryButtonOnListSelect(button) {
    if (!button) { showCategoryError(); }
    let indexOfCategory = addTaskUtils.getIndexOfObjectOfArray(button.getAttribute('id'), categories);
    if (indexOfCategory < 0) { showCategoryError(); }
    currentCategory = categories[indexOfCategory];
    hideCategoryListForSelect();
    setCategoryInputfieldValue(currentCategory['title']);
    checkCategoryInputValue();
}


//NOTE - Den entsprechenden Text in das Categorie Inputfeld schreiben
function setCategoryInputfieldValue(value) {
    document.getElementById('task-category').value = value;
}

//NOTE - Hier bekommt der Kleine Buttun im Inputfeld die passende Funktion show oder hide
function setCategoryShowOrHideButton(showOrHide) {
    const buttonShowOhrHide = document.getElementById('show-and-hide-categories');
    buttonShowOhrHide.setAttribute('onclick', (showOrHide == "show" ? 'showAndHideCategories("hide")' : 'showAndHideCategories("show")'));
}

//NOTE - Auslöser, wenn in das Inputfeld 'Category' geklickt wird. Wenn die Auswahlliste offen ist, wird diese geschlossen, 
// sonst öffnet sich die Liste.
function onclickCategoryInput(inputField) {
    if (isCategoryListOpen) {
        inputField.blur();
        hideCategoryListForSelect();
        checkCategoryInputValue();
    } else {
        showAndHideCategories('show');
    }
}

//NOTE - Categorie Inputfeld abfragen und prüfen, ob dies eine Auswahl besitzt oder nicht.
// Wenn keine Auswahl getroffen wurde, wird der Errortext angezeigt und der Rahmen eingefärbt.
function checkCategoryInputValue() {
    let categoryInput = document.getElementById('task-category');
    if (!categoryInput) { return; }
    if (categoryInput.value == "Select task category") {
        showAndLeaveErrorMessage('a-t-category-required', true);
        showAndLeaveErrorBorder('task-category', true);
    } else {
        showAndLeaveErrorMessage('a-t-category-required', false);
        showAndLeaveErrorBorder('task-category', false);
    }

}
//!SECTION Ende der Section Categorieauswahl

//SECTION - Subtask Auswahl

function onclickSubtaskInput(input) {
    if (!input) { return; }
    toggleSubWritingButtons();
}

function toggleSubWritingButtons() {
    document.getElementById('sub-writing-buttons').classList.toggle('d-none');
}

function adoptCurrentSubEntry() {
    let inputfield = document.getElementById('task-sub-task');
    if (!inputfield) { return; }
    const inputValueClean = (inputfield.value ?? "").trim();
    if (inputValueClean.length > 3) {
        currentSubTasks = addTaskUtils.addSubtaskToArray(inputValueClean, currentSubTasks);
    }
    clearSubInputField();
    renderSubtasks();
}

function clearSubInputField() {
    let inputfield = document.getElementById('task-sub-task');
    if (!inputfield) { return; }
    inputfield.value = "";
    toggleSubWritingButtons();
    inputfield.blur();

}

function deleteCurrentSelectedSubTask(subtaskID) {
    currentSubTasks = addTaskUtils.removeSubtaskFromArray(subtaskID, currentSubTasks);
    renderSubtasks();
}

function editCurrentSelectedSubTask(subtaskID) {
    renderSubtasks(subtaskID);
}

function renderSubtasks(idForEdit = "") {
    let subTaskList = document.querySelector('.sub-task-list');
    subTaskList.innerHTML = "";
    if (currentSubTasks.length == 0) { return; }
    let counter = 0;
    if (!subTaskList) { return; }

    for (let i = 0; i < currentSubTasks.length; i++) {
        if (currentSubTasks[i]['id'] == idForEdit) {
            subTaskList.innerHTML += getSubtaskListElementForChanging(currentSubTasks[i]);
            continue;
        }
        subTaskList.innerHTML += getSubtaskListElementReadOnly(currentSubTasks[i]);
        counter++;
        if (counter >= 3) { break; }
    }
}

function safeChangesOnCurrentSelectedSubtask(subtaskID) {
    let currentSubTask = currentSubTasks.find(x => x['id'] == subtaskID);
    if (!currentSubTask) { return; }
    const inputField = document.getElementById(`subTaskEdit-${subtaskID}`);
    const inputValueClean = (inputField.value ?? "").trim();
    if (inputValueClean <= 3) { return; }
    currentSubTask['title'] = inputField.value;
    renderSubtasks();
}

//!SECTION Substask Auswahl Ende

//SECTION - FormEvent

//Daten aus dem Form und den lokalen Daten aufebreiten und neuen Task erstellen
async function addTaskCreateTask(event) {

    if (event) event.preventDefault();
    const addTaskFormData = new FormData(event.currentTarget);
    const currentTask = new Task(
        getNewUid(),
        addTaskFormData.get('task-title'),
        addTaskFormData.get('task-description'),
        addTaskFormData.get('due-date'),
        currentPriority,
        currentCategory['id'],
        "todo"
    );

    const createNewTask = new CreateNewTask(currentTask, currentSubTasks, currentContactAssignList);
    await createNewTask.start();
    addTaskAfterSafe(event.currentTarget.classList[0] == "add-task-form-dialog");
}


function addTaskAfterSafe(fromDialog = false) {
    toggleDialogDisplay();
    const dialog = document.getElementById('add-task-safe-dialog');
    dialog.classList.add('safe-dialog-show');
    dialog.showModal();
    setTimeout(function () {
        dialog.close();
        navigateToBoardAfterDialog(fromDialog);
    }, 1800);
}

function navigateToBoardAfterDialog(fromDialog = false) {
    if(fromDialog == true){
        closeDialog('add-task-dialog');
        setTimeout(function() {
            navigateToBord();
        }, 1000)
    }else{
        navigateToBord();
    }
}


function toggleDialogDisplay() {
    document.getElementById('add-task-safe-dialog').classList.toggle('visually-hidden');
}

function addTaskFormClear() {
    location.reload();
}




//!SECTION - FormEvent Ende





