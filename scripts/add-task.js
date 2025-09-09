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
        includeHtml("navbar", "navbar-desktop.html"),
        includeHtml("header", "header-desktop.html"),
        includeHtml("add-task-content", "add-task.html")
    ]);

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
    document.getElementsByTagName('body')[0].setAttribute("onmouseup", "addTaskWindowMouseClick(event)");
}


/**
 * Loads necessary data for the Add Task view, including contacts and categories.
 * @param {boolean} fromDialog - Indicates if the view is loaded from a dialog.
 */
async function loadDataForAddTask(fromDialog = false) {
    await loadContactsAllFromDB();
    await loadCategoriesFromDB();
    setNewPriority("Medium");
    fromDialog == false ? renderUserInitial() : "";
    currentUser = addTaskUtils.readCurrentUserID();
    isGuest = addTaskUtils.isCurrentUserGuest();
}

/**
 * Loads all contacts from the database and sorts them.
 * Utilizes the getSortedContact function from db-functions.js.
 */
async function loadContactsAllFromDB() {
    contactAllListFromDB = await getSortedContact()
}

/**
 * Loads categories from the database.
 * Utilizes the getAllData function from db-functions.js.
 */
async function loadCategoriesFromDB() {
    categories = await getAllData("categories");
}

/**
 * Shows and leaves an error message for the specified target.
 * @param {string} messageTarget - The ID of the message target element.
 * @param {boolean} visibility - Indicates whether to show or hide the error message.
 * @returns {void}
 */
function showAndLeaveErrorMessage(messageTarget, visibility = true) {
    let errorField = document.getElementById(messageTarget);
    if (errorField == null) { return; }
    if (visibility) {
        errorField.classList.remove("error-text-hidden");
        errorField.classList.add('error-text-show');
    } else {
        errorField.classList.add("error-text-hidden");
        errorField.classList.remove('error-text-show');
    }
}

/**
 * Shows and leaves an error border for the specified input field.
 * @param {string} inputTarget - The ID of the input field.
 * @param {boolean} visibility - Indicates whether to show or hide the error border.
 * @returns {void}
 */
function showAndLeaveErrorBorder(inputTarget, visibility = true) {
    let inputField = document.getElementById(inputTarget);
    if (inputField == null) { return; }
    if (visibility) {
        inputField.classList.add('input-has-error');
    } else {
        inputField.classList.remove('input-has-error');
    }
}

 /**
 * Handles mouse click events within the Add Task window.
 * @param {MouseEvent} e - The mouse event object.
 */
function addTaskWindowMouseClick(e) {

    if (!e.target.closest(".contact-select-container") && !e.target.closest(".contact-List-container") && isContactListOpen) {
        showAndHideContacts("hide");
    }

    if (!e.target.closest('.category-select-container') && !e.target.closest('.category-list-container') && isCategoryListOpen) {
        showAndHideCategories('hide');
    }
}

/**
 * Checks if all required fields are filled and enables/disables the create button accordingly.
 */
function addTaskCheckRequiredField() {

    let createButton = document.getElementById('createTaskButton');

    createButton.disabled =
        currentDueDate.length > 0 &&
            currentTitle.length > 0 &&
            currentPriority.length > 0 &&
            currentCategory.hasOwnProperty("title") ? false : true;

}

/**
 * Handles the mouse click event on the Add Task form to validate required fields.
 */
function addTaskSubmitOnMouse() {
    document.getElementById('task-title').blur();
    document.getElementById('due-date-display').blur();
    addTaskCheckRequiredField();

}

/**
 * Handles input event on the task title field to validate the title.
 */
function addTaskTitleOnInput() {
    let titleValue = document.getElementById('task-title');

    if (!titleValue.value) {
        showAndLeaveErrorMessage("a-t-title-required", true);
        showAndLeaveErrorBorder("task-title", true);
    } else {
        taskTitleValidation(titleValue.value);
    }
}

/**
 * Validates the task title.
 * @param {string} titleValue - The value of the task title.
 */
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

/**
 * Validates the due date field.
 * Utilizes the startDueDateValidation function from due-date-validation.js.
 */
function dateFieldOnChange() {
    startDueDateValidation();
}

/**
 * Handles the click event on the date icon to show the date picker.
 */
function onDateIconClick() {
    let datePicker = document.getElementById('due-date-hidden');
    datePicker.showPicker();
}

/**
 * Handles the change event on the date picker.
 * @param {Event} e - The change event object.
 */
function datePickerSelectionChange(e) {
    let newDateArr = String(e.target.value).split('-');
    let newDateString = `${newDateArr[2]}/${newDateArr[1]}/${newDateArr[0]}`;
    document.getElementById('due-date-display').value = newDateString;
    dateFieldOnChange();
}

/**
 * Handles the selection of a priority button in the Add Task form.
 * @param {HTMLElement} button - The priority button element.
 * @returns {void}
 */
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

/**
 * Resets all priority buttons to their default state (not selected).
 */
function allPriortyButtonsReset() {
    currentPriority = "";
    const btnContainer = document.getElementById('task-priority-button');
    const buttons = btnContainer.querySelectorAll('.btn');

    buttons.forEach((b) => {
        b.setAttribute('data-selected', 'false');
        setButtonSytleNotActiv(b);
    });
}

/**
 * Sets a new priority for the task.
 * @param {string} priority - The name of the priority to set.
 */
function setNewPriority(priority) {
    const btnContainer = document.getElementById('task-priority-button');
    const buttons = btnContainer.querySelectorAll('.btn');

    buttons.forEach((b) => {

        if (b.getAttribute('name') == priority) {
            b.setAttribute('data-selected', 'true');
            setButtonStyleActiv(b);

        } else {
            b.setAttribute('data-selected', 'false');
            setButtonStyleNotActiv(b);
        }

    });

    currentPriority = priority;

}

/**
 * Sets the button to the active state (selected).
 * @param {HTMLElement} button - The button element to activate.
 * @returns {void}
 */
function setButtonStyleActiv(button) {
    if (!button) { return; }
    button.classList.add(`prio-${button.getAttribute('data-name')}-selected`);
    togglePrioButtonTextColor(button, "white");
}

/**
 * Sets the button to the inactive state (not selected).
 * @param {HTMLElement} button - The button element to deactivate.
 * @returns {void}
 */
function setButtonStyleNotActiv(button) {
    if (!button) { return; }
    button.classList.remove(`prio-${button.getAttribute('data-name')}-selected`);
    togglePrioButtonTextColor(button, "black");
}

/**
 * Toggles the text color of the priority button.
 * @param {HTMLElement} button - The button element to modify.
 * @param {string} whiteOrBlack - The color to set the text to ("white" or "black").
 * @returns {void}
 */
function togglePrioButtonTextColor(button, whiteOrBlack) {
    if (!button) { return; }
    let btnText = button.querySelector('p');
    if (whiteOrBlack == "white") {
        btnText.classList.add('prio-selected');
    } else {
        btnText.classList.remove('prio-selected');
    }

}

/**
 * Shows or hides the contact selection input field.
 * @param {string} showOrHide - Determines whether to show or hide the contact list.
 */
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

/**
 * Renders the show icon for the contact selection.
 * @param {string} elementID - The ID of the element to modify.
 * @returns {void}
 */
function renderShowIcon(elementID) {
    const iconDiv = document.getElementById(elementID);
    if (!iconDiv) { return; }
    iconDiv.classList.remove('icon-hide-list');
    iconDiv.classList.add('icon-show-list');
}

/**
 * Renders the hide icon for the contact selection.
 * @param {string} elementID - The ID of the element to modify.
 * @returns {void}
 */
function renderHideIcon(elementID) {
    const iconDiv = document.getElementById(elementID);
    if (!iconDiv) { return; }
    iconDiv.classList.add('icon-hide-list');
    iconDiv.classList.remove('icon-show-list');
}

/**
 * Shows the contact list for selection. 
 * If a current contact list is provided, it uses that; otherwise, it uses the full contact list from the database.
 * Additionally, it adjusts the height of the contact list container based on the number of contacts.
 * @param {Array} currentContactList 
 * @returns {void}
 */
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

/**
 * Hides the contact list dropdown for task selection.
 * 
 * This function collapses the contact list container and the contact list itself by setting their heights to zero
 * using `requestAnimationFrame` for smooth UI updates. It also clears the contact list's contents and updates
 * the `isContactListOpen` flag to indicate that the contact list is closed.
 *
 * Side Effects:
 * - Modifies the DOM elements with IDs 'contact-List-container' and 'contact-List-for-task'.
 * - Sets the global variable `isContactListOpen` to `false`.
 */
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

/**
 * Renders the contact options for selection.
 * Using TaskUtils to check if the contact is already assigned to the task.
 * @param {Array} contactList 
 */
function renderContactOptions(contactList) {
    let contactSelectElement = document.getElementById('contact-List-for-task');
    contactSelectElement.innerHTML = "";

    for (let i = 0; i < contactList.length; i++) {
        const currentContactAssigned = addTaskUtils.findContactInAssignList(contactList[i], currentContactAssignList);
        contactSelectElement.innerHTML += getContactListElement(contactList[i], currentContactAssigned);
    }
}

/**
 * Handles the selection of a contact button in the list.
 * Uses TaskUtils to check if the contact is available and toggles its selection state.
 * @param {HTMLElement} currentContactBtn - The button element representing the selected contact.
 * @returns {void}
 */
function contactButtonOnListSelect(currentContactBtn) {

    const contactID = currentContactBtn.getAttribute('id');
    if (!addTaskUtils.checkIfContactAvailable(contactID, contactAllListFromDB)) { return; }

    currentContactBtn.getAttribute('data-active') == "true" ?
        checkOutContact(currentContactBtn, contactID) : checkInContact(currentContactBtn, contactID);

}

/**
 * Adds the selected contact to the task and updates the UI accordingly.
 * Uses TaskUtils to manage the contact assignment list.
 * Changes the styling of the selected contact to indicate its selection.
 * @param {*} currentContact 
 * @param {string} contactID 
 */
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

/**
 * Removes the selected contact from the task and updates the UI accordingly.
 * Uses TaskUtils to manage the contact assignment list.
 * Changes the styling of the selected contact to indicate its removal.
 * @param {*} currentContact 
 * @param {string} contactID 
 */
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

/**
 * Filters the contact list based on the input value.
 * Uses TaskUtils to filter contacts from the full contact list.
 * @param {string} inputValue 
 */
function filterContactFromInputValue(inputValue) {
    showContactListForSelect(addTaskUtils.filterContacts(inputValue, contactAllListFromDB));
}

/**
 * Shows or hides the badge container for assigned contacts.
 * @param {string} showOrHide 
 * @returns {void}
 */
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

/**
 * Renders the assigned profile badges for the selected contacts.
 * If no contacts are assigned, the function returns early.
 * Show only up to 4 badges for better UI.
 * @returns {void}
 */
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

/**
 * Shows or hides the category list for selection.
 * @param {string} showOrHide 
 */
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

/**
 * Shows the category list for selection.
 * If no categories are available, the function returns early.
 * Renders the category options and adjusts the height of the category list container based on the number of categories.
 * @returns {void}
 */
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

/**
 * Hides the category list for selection.
 * Uses `requestAnimationFrame` to smoothly collapse the category list container and the category list itself by setting their heights to zero.
 * @returns {void}
 */
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

/**
 * Renders the category options for selection.
 * If no categories are available, the function returns early.
 * @param {Array} categories 
 */
function renderCategoryOptions(categories) {
    let categorySelectElement = document.getElementById('category-list-for-task');
    categorySelectElement.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        categorySelectElement.innerHTML += getCategoryListElement(categories[i]);
    }
}

/**
 * Handles the selection of a category from the list.
 * If no button is provided, an error is shown.
 * If the selected category is not found in the categories array, an error is shown.
 * Sets the current category and updates the input field value.
 * Hides the category list after selection and checks the category input value for validation.
 * Uses TaskUtils to find the index of the selected category in the categories array.
 * @param {HTMLElement} button - The button element representing the selected category.
 */
function categoryButtonOnListSelect(button) {
    if (!button) { showCategoryError(); }
    let indexOfCategory = addTaskUtils.getIndexOfObjectOfArray(button.getAttribute('id'), categories);
    if (indexOfCategory < 0) { showCategoryError(); }
    currentCategory = categories[indexOfCategory];
    hideCategoryListForSelect();
    setCategoryInputfieldValue(currentCategory['title']);
    checkCategoryInputValue();
}

/**
 * Sets the value of the category input field.
 * @param {string} value - The value to set in the category input field.
 */
function setCategoryInputfieldValue(value) {
    document.getElementById('task-category').value = value;
}

/**
 * Sets the onclick attribute for the show/hide button.
 * @param {string} showOrHide 
 */
function setCategoryShowOrHideButton(showOrHide) {
    const buttonShowOrHide = document.getElementById('show-and-hide-categories');
    buttonShowOrHide.setAttribute('onclick', (showOrHide == "show" ? 'showAndHideCategories("hide")' : 'showAndHideCategories("show")'));
}

/**
 * Handles the click event on the category input field.
 * If the category list is open, it blurs the input field, hides the category list, and checks the input value.
 * If the category list is closed, it shows the category list.
 * @param {HTMLElement} inputField - The input field element for the category.
 */
function onclickCategoryInput(inputField) {
    if (isCategoryListOpen) {
        inputField.blur();
        hideCategoryListForSelect();
        checkCategoryInputValue();
    } else {
        showAndHideCategories('show');
    }
}

/**
 * Checks the value of the category input field for validity.
 * If the input field is empty or has the default placeholder value, it shows an error message and border.
 * If a valid category is selected, it hides the error message and border.
 * @returns void
 */
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

/**
 * Handles the click event on the subtask input field.
 * If the subtask writing buttons are not visible, it shows them.
 * If they are visible, it hides them.
 * @param {HTMLElement} input - The input field element for the subtask.
 * @returns void
 */
function onclickSubtaskInput(input) {
    if (!input) { return; }
    toggleSubWritingButtons();
}

/**
 * Toggles the visibility of the subtask writing buttons.
 */
function toggleSubWritingButtons() {
    document.getElementById('sub-writing-buttons').classList.toggle('d-none');
}

/**
 * Adopts the current subtask entry.
 * If the input field is empty or has less than 3 characters, it does nothing.
 * Otherwise, it adds the subtask to the current subtask list, clears the input field, and renders the subtasks.
 * Uses TaskUtils to manage the subtask list.
 * @returns void
 */
function adoptCurrentSubEntry() {
    let inputfield = document.getElementById('task-sub-task');
    if (!inputfield) { return; }
    const inputValueClean = (inputfield.value ?? "").trim();
    if (inputValueClean.length >= 3) {
        currentSubTasks = addTaskUtils.addSubtaskToArray(inputValueClean, currentSubTasks);
    }
    clearSubInputField();
    renderSubtasks();
}

/**
 * Clears the subtask input field.
 * If the input field is not found, it does nothing.
 * Otherwise, it clears the input field, toggles the visibility of the subtask writing buttons, and removes focus from the input field.
 * @returns void
 */
function clearSubInputField() {
    let inputfield = document.getElementById('task-sub-task');
    if (!inputfield) { return; }
    inputfield.value = "";
    toggleSubWritingButtons();
    inputfield.blur();

}

/**
 * Deletes the currently selected subtask.
 * Uses TaskUtils to remove the subtask from the current subtask list.
 * Renders the updated list of subtasks.
 * @param {string} subtaskID - The ID of the subtask to delete.
 * @returns void
 */
function deleteCurrentSelectedSubTask(subtaskID) {
    currentSubTasks = addTaskUtils.removeSubtaskFromArray(subtaskID, currentSubTasks);
    renderSubtasks();
}

/**
 * Edits the currently selected subtask.
 * @param {string} subtaskID - The ID of the subtask to edit.
 * @returns void    
 */
function editCurrentSelectedSubTask(subtaskID) {
    renderSubtasks(subtaskID);
}

/**
 * Renders the list of subtasks.
 * If there are no subtasks, it returns early.
 * If an ID for editing is provided, it renders that subtask in edit mode.
 * Otherwise, it renders all subtasks in read-only mode, showing only up to 3 subtasks for better UI.
 * @param {string} idForEdit - The ID of the subtask to edit.
 * @returns void
 */
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

/**
 * Safely applies changes to the currently selected subtask.
 * If the subtask is not found, it does nothing.
 * If the input value is less than or equal to 3 characters, it does nothing.
 * Otherwise, it updates the subtask title and re-renders the subtasks.
 * @param {string} subtaskID - The ID of the subtask to edit.
 * @returns void
 */
function safeChangesOnCurrentSelectedSubtask(subtaskID) {
    let currentSubTask = currentSubTasks.find(x => x['id'] == subtaskID);
    if (!currentSubTask) { return; }
    const inputField = document.getElementById(`subTaskEdit-${subtaskID}`);
    const inputValueClean = (inputField.value ?? "").trim();
    if (inputValueClean <= 3) { return; }
    currentSubTask['title'] = inputField.value;
    renderSubtasks();
}

/**
 * Handles the creation of a new task.
 * Prepares the data from the form and the local data to create a new task.
 * Uses the CreateNewTask class to handle the task creation process.
 * After the task is created, it shows a confirmation dialog and navigates to the board view.
 * @param {Event} event - The event object from the form submission.
 */
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

    const createNewTask = new CreateNewTask(currentTask, currentSubTasks, currentContactAssignList, currentUser);
    await createNewTask.start();
    addTaskAfterSafe(event.currentTarget.classList[0] == "add-task-form-dialog");
}

/**
 * Shows a confirmation dialog after a task is successfully added.
 * Closes the Add Task dialog if it was opened from a dialog view.
 * Navigates to the board view after the confirmation dialog is closed.
 * @param {boolean} fromDialog - Indicates if the call is from a dialog.
 */
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

/**
 * Navigates to the board view after the confirmation dialog.
 * If the call is from a dialog, it closes the Add Task dialog first and then navigates to the board after a delay.
 * @param {boolean} fromDialog - Indicates if the call is from a dialog.
 */
function navigateToBoardAfterDialog(fromDialog = false) {
    if(fromDialog == true){
        closeDialog('add-task-dialog');
        setTimeout(function() {
            navigateToBoard();
        }, 1000)
    }else{
        navigateToBoard();
    }
}

/**
 * Toggles the display of the Add Task confirmation dialog.
 */
function toggleDialogDisplay() {
    document.getElementById('add-task-safe-dialog').classList.toggle('visually-hidden');
}

/**
 * Clears the Add Task form by reloading the page.
 * This effectively resets all form fields and local data.
 */
function addTaskFormClear() {
    location.reload();
}




