let currentDueDate = "";
let currentTitle = "";
let contactAllListFromDB = [];
let isContactListOpen = false;
let currentContactAssignList = [];
let currentPrioity = "";
let categories = [];


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


//NOTE - Startfunktion 1. Kontakte laden
async function loadDataForAddTaskViewAndRenderView() {
    await loadContactsAllFomDB();
    await loadCategoriesFromDB();
   
}

//NOTE - Lade alle Kontakte aus der DB in das Array
async function loadContactsAllFomDB() {
    contactAllListFromDB = await getSortedContact()
}


async function loadCategoriesFromDB() {
    categories = await getAllData("categories");
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
        renderHideContactsIcon();
        showOrHideBadgeContainer("hide");
    } else {
        inputField.value = "Select contacts to assign";
        hideContactListForSelect();
        renderShowContactsIcon();
        showOrHideBadgeContainer("show");
    }
}

//TODO - Zusammenfassen, in eine Funktion -> show oder hide übergeben

//NOTE - Anzeigen des Pfeil nach unten -> Show
function renderShowContactsIcon() {
    const iconDiv = document.getElementById('show-or-hide-icon');
    iconDiv.classList.remove('icon-hide-contacts');
    iconDiv.classList.add('icon-show-contacts');
}

//NOTE - Anzeigen des Pfeils nach oben -> Hide
function renderHideContactsIcon() {
    const iconDiv = document.getElementById('show-or-hide-icon');
    iconDiv.classList.add('icon-hide-contacts');
    iconDiv.classList.remove('icon-show-contacts');
}

//NOTE - Kontaktlist zum rendern erstellen. Vorbereitung für die Suche.
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
    contactListContainer.style.height = "100px";
    contactList.style.height = "80px";

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
        const currentContactAssigned = findContactInAssignList(contactList[i]);
        contactSelectElement.innerHTML += getContactListElement(contactList[i], currentContactAssigned);
    }
}

//NOTE - einen Kontakt in der Assigned Liste suchen, sofern vorhanden. Damit das Aussehen angepasst werden kann.
function findContactInAssignList(contact) {
    if(currentContactAssignList.length == 0){return false;}
    return getIndexOfContactOfArray(contact['id'], currentContactAssignList) != -1;
}

//NOTE - Hinzufügen oder löschen aus der Assigned Liste, jenachdem ob das Attibut "active" true oder nicht gesetzt ist.
//TODO - Vieleicht eine bessere Möglichkeit finden
function contactButtonOnListSelect(currentContactBtn) {

    const contactID = currentContactBtn.getAttribute('id');
    if (!checkIfContactAvailable(contactID)) { return; }
    const contactState = currentContactBtn.getAttribute('active');

    if (contactState == "true") {
        checkOutContact(currentContactBtn, contactID);
    } else {
        checkInContact(currentContactBtn, contactID);
    }
    
}

//NOTE - Prüfen, ob der Kontakt überhaupt vorhanden ist
function checkIfContactAvailable(currentContactID) {
    return getIndexOfContactOfArray(currentContactID, contactAllListFromDB) != -1;
}

//NOTE - Den Kontakt der Liste zuführen und Styling anpassen.
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

//NOTE - Den Kontakt aus der Liste entfernen und Styling anpassen.
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

//NOTE Den Kontakt mit der ID aus dem gesammten Array filtern und in die Assigned Liste einfügen
function contactAddToTask(currentContactID) {
    const indexOfContact = getIndexOfContactOfArray(currentContactID, contactAllListFromDB);
    if(indexOfContact > -1){
        currentContactAssignList.push(contactAllListFromDB[indexOfContact]);
    }
   
}

//NOTE - Den Kontakt mit der ID in der Assigned Liste suchen und dann entfernen
function contactRemoveFromTask(currentContactID) {
    const indexOfContact = getIndexOfContactOfArray(currentContactID, currentContactAssignList);
    if(indexOfContact > -1){
        currentContactAssignList.splice(indexOfContact, 1);
    }
}


function filterContactFromInputValue(inputValue) {
    const inputCleanValue = (inputValue ?? "").trim();
    if(inputCleanValue.length < 2){return;}
    const filteredContacts = contactAllListFromDB.filter((c) => c['firstname'].toLowerCase().startsWith(inputCleanValue.toLowerCase()));
    showContactListForSelect(filteredContacts);
} 




//NOTE - Diese Funktion wurde dem Body inzugefügt, um die Mausklicks abzufangen. Wenn die Liste offen ist und ein anders Elemet
// Ausser den hier angegebenen geklickt wird, schliesst sich das Fenster, wie beim Klick auf den Pfeil nach oben.
function addTaskWindowMouseClick(e) {

    if(!e.target.closest(".contact-select-container") && !e.target.closest(".contact-List-container") && isContactListOpen){
        showAndHideContacts("hide");
    }
}

//NOTE -  den Index eines KontaktArrays aus der ID finden
//TODO - Generisch machen, kann auch für Categorie und Subtask genutzt werden
function getIndexOfContactOfArray(contactID, contactArray) {

    let contactFind = contactArray.find(x => x['id'] == contactID);
    if(contactFind == null) {return -1;}
    return contactArray.indexOf(contactFind);
}


function showOrHideBadgeContainer(showOrHide = "") {
    if(showOrHide.length == 0) {return;}
    let container = document.getElementById('contact-assigned-badge');
    if(showOrHide == "show"){
        container.classList.remove('d-none');
        renderAsignedProfilBadge();
    }else{
        container.classList.add('d-none');
        container.innerHTML = "";
    }
}


function renderAsignedProfilBadge(){
    if(currentContactAssignList.length == 0){
        return;
    }

    let badgeContainer = document.getElementById('contact-assigned-badge');
    badgeContainer.innerHTML = "";
    let counter = 0;
    for (let i = 0; i < currentContactAssignList.length; i++){
        badgeContainer.innerHTML += getAssignedContactBadge(currentContactAssignList[i]);
        counter++;
        if(counter == 4){break;}
    }
}



function addTaskPrioritySelect(button) {
    if(!button){return;}
    
    const buttonName = button.getAttribute('name');
    const isActiv = button.getAttribute('activ') == "true";

    if(currentPrioity == buttonName && isActiv){
        allPriortyButtonsReset();
    }else {
        setNewPriority(buttonName);
    }

}

function allPriortyButtonsReset() {
    currentPrioity = "";
    const btnContainer = document.getElementById('task-priority-button');
    const buttons = btnContainer.querySelectorAll('.btn');

    buttons.forEach((b) => {
        b.setAttribute('activ', '');
        setButtonSytleNotActiv(b);
    });
}

function setNewPriority(priority) {
    const btnContainer = document.getElementById('task-priority-button');
    const buttons = btnContainer.querySelectorAll('.btn');

    buttons.forEach((b) => {

        if(b.getAttribute('name') == priority){
            b.setAttribute('activ', 'true');
            setButtonStyleActiv(b);
            
        }else{
            b.setAttribute('activ', '');
            setButtonSytleNotActiv(b);
        }
        
    });

    currentPrioity = priority;
}


function setButtonStyleActiv(button){
    if(!button){return;}
    button.classList.add(`prio-${button.getAttribute('name')}-selected`);
    togglePrioButtonTextColor(button, "white");
}

function setButtonSytleNotActiv(button) {
    if(!button){return;}
    button.classList.remove(`prio-${button.getAttribute('name')}-selected`);
    togglePrioButtonTextColor(button, "black");
}

function togglePrioButtonTextColor(button, whiteOrBlack) {
    if(!button){return;}
    let btnText = button.querySelector('p');
    if(whiteOrBlack == "white"){
        btnText.classList.add('prio-selected');
    }else{
        btnText.classList.remove('prio-selected');
    }
    
}