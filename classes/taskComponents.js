/**
 * Class to manage task components including contacts, categories, priorities, and subtasks.
 * This class provides methods to load and manipulate task-related data.
 * It interacts with Firebase for data retrieval and updates the UI accordingly.
 * It also includes validation for task title and due date.
 * It is designed to be used in a task management application.
 * Example usage:
 * const taskComponents = new TaskComponents(currentUser, 'taskInstance', 'stateCategory');
 */

class TaskComponents{

    contactAllListFromDB = [];
    categories = [];
    currentDueDate = "";
    currentDueDateInputValue = "";
    currentTitle = "";
    isContactListOpen = false;
    currentContactAssignList = [];
    currentPriority = "";
    isCategoryListOpen = false;
    currentCategory = {};
    currentSubTasks = [];
    addTaskUtils = new AddTaskUtils();
    currentTask = null;
    currentTaskId = "";


    /**     
     * Constructor for the TaskComponents class.
     * @param {User} currentUser - The current user object.
     * @param {string} currentInstance - The current instance identifier.
     * @param {string} currentStateCategory - The current state category for the task.
     */
    constructor(currentUser, currentInstance, currentStateCategory) {
        this.currentUser = currentUser;
        this.currentInstance = currentInstance;
        this.currentStateCategory = currentStateCategory;
    }

    /**
     * Initializes the task components and loads necessary data.
     * @returns {Promise<void>}
     */
    async run() {
        await this.loadContactsAllFromDB();
        await this.loadCategoriesFromDB();
        this.setNewPriority("Medium");
    }

    /**
     * Runs the task components with the specified data as view.
     * @param {Object} currentTask - The current task object.
     * @returns {Promise<void>}
     */
    async runWithDataAsView(currentTask) {
        this.currentTask = currentTask;
        this.currentTaskId = this.currentTask['id'];
        const boardUtils = new BoardTaskDetailViewUtils(this.currentTaskId, this.currentTask, this.currentInstance);
        openDialog('detail-view-task-dialog');
        boardUtils.startRenderTaskDetails();
        const currentMainHeight = boardUtils.getCurrentHeight();
        boardUtils.setDialogHeight(currentMainHeight);
        this.currentSubTasks = currentTask['subTasks'];
    }

    /**
     * Runs the task components with the specified data as edit.
     * @param {Object} currentTask - The current task object.
     * @returns {Promise<void>}
     */
    async runWithDataAsEdit(currentTask) {
        this.currentTask = currentTask;
        this.currentTaskId = this.currentTask['id'];
        const boardEditUtil = new BoardTaskDetailEditUtils(this.currentTaskId, this.currentTask, this.currentInstance);
        await boardEditUtil.startRenderTaskEdit();
        await this.loadContactsAllFromDB();
        await this.loadCategoriesFromDB();
        this.setNewPriority(this.currentTask['priority']);
        this.currentContactAssignList = boardEditUtil.getCurrentAssignList();
        this.showOrHideBadgeContainer('show');
        this.currentSubTasks = currentTask['subTasks'];
        this.renderSubtasks();
        document.getElementById('detail-edit-ok-btn').setAttribute('data-id', this.currentTaskId);
        document.querySelector('body').setAttribute("onmouseup", `${this.currentInstance}.addTaskWindowMouseClick(event)`);
        this.readCurrentTaskDateIntoVariables();
    }

    /**
     * Reads the current task date into variables.
     * @returns {void}
     */
    readCurrentTaskDateIntoVariables(){
        this.currentSubTasks = this.currentTask['subTasks'];
        this.currentDueDate = this.currentTask['dueDate'];
        this.currentTitle = this.currentTask['title'];
        this.currentCategory = this.currentTask['categoryData'];
    }

    /**
     * Adds the task title on input change.
     * @returns {void}
     */
    addTaskTitleOnInput() {
        let titleValue = document.getElementById('task-title');
        if (!titleValue.value) {
            this.showAndLeaveErrorMessage("a-t-title-required", true);
            this.showAndLeaveErrorBorder("task-title", true);
        } else {
            this.taskTitleValidation(titleValue.value);
        }
    }

    /**
     * Gets the task details for submission.
     * @returns {Array} - The task details array.
     */
    get getTaskDetails() {
        return [this.currentPriority, this.currentCategory['id'], this.currentSubTasks, this.currentContactAssignList];
    }

    /**
    * Loads all contacts from the database and sorts them.
    * Utilizes the getSortedContact function from db-functions.js.
    */
    async loadContactsAllFromDB() {
        const fb = new FirebaseDatabase();
        this.contactAllListFromDB = await fb.getFirebaseLogin(() => fb.getSortedContact());
    }

    /**
    * Loads categories from the database.
    * Utilizes the getAllData function from db-functions.js.
    * @returns {Promise<void>}
    */
    async loadCategoriesFromDB() {
        const fb = new FirebaseDatabase();
        this.categories = await fb.getFirebaseLogin(() => fb.getAllData("categories"));
    }

    /**
    * Shows and leaves an error message for the specified target.
    * @param {string} messageTarget - The ID of the message target element.
    * @param {boolean} visibility - Indicates whether to show or hide the error message.
    * @returns {void}
    */
    showAndLeaveErrorMessage(messageTarget, visibility = true) {
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
    showAndLeaveErrorBorder(inputTarget, visibility = true) {
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
    * @returns {void}
    */
    addTaskWindowMouseClick(e) {

        if (!e.target.closest(".contact-select-container") && !e.target.closest(".contact-List-container") && this.isContactListOpen) {
            this.isContactListOpen = false;
            this.showAndHideContacts("hide");
        }

        if (!e.target.closest('.category-select-container') && !e.target.closest('.category-list-container') && this.isCategoryListOpen) {
            this.isCategoryListOpen = false;
            this.showAndHideCategories('hide');
        }
    }

    /**
    * Checks if all required fields are filled and enables/disables the create button accordingly.
    * @param {HTMLElement} createButton - The create button element.
    * @return {void}
    */
    addTaskCheckRequiredField(createButton) {

        if(!createButton){return;}

        const hasCategory = this.currentCategory && typeof this.currentCategory === 'object' && 'title' in this.currentCategory;
        createButton.disabled = !(
            this.currentDueDate.length > 0 &&
                this.currentTitle.length > 0 &&
                this.currentPriority.length > 0 &&
                hasCategory);

        createButton.disabled ? createButton.setAttribute('aria-disabled', 'true') : createButton.removeAttribute('aria-disabled');

    }

    /**
    * Handles the mouse click event on the Add Task form to validate required fields.
    * @param {HTMLElement} button - The button element that was clicked.
    * @return {void}
    */
    addTaskSubmitOnMouse(button) {
        document.getElementById('task-title').blur();
        document.getElementById('due-date-display').blur();
        this.addTaskCheckRequiredField(button);
    }

    /**
    * Validates the task title.
    * @param {string} titleValue - The value of the task title.
    * @return {void}
    */
    taskTitleValidation(titleValue = "") {
        const cleanTitleValue = (titleValue ?? "").trim();

        if (cleanTitleValue.length > 3) {
            this.showAndLeaveErrorMessage("a-t-title-required", false);
            this.showAndLeaveErrorBorder("task-title", false);
            this.currentTitle = cleanTitleValue;
        } else {
            this.showAndLeaveErrorMessage("a-t-title-required", true);
            this.showAndLeaveErrorBorder("task-title", true);
            this.currentTitle = "";
        }

    }

    /**
    * Validates the due date field.
    * @return {void}
    */
    dateFieldOnChange() {
        let dateField = document.getElementById('due-date-display');
        if (!dateField) { return; }
        const dueDateCheck = new DueDateCheck(dateField.value, this.currentDueDate, this.currentDueDateInputValue, this);
        const [result, dueDate] = dueDateCheck.startDueDateValidation();
        this.currentDueDate = result ? dueDate : "";
        this.currentDueDateInputValue = dateField.value;
    }

    /**
     * Handles the click event on the date icon to show the date picker.
     * @return {void}
     */
    onDateIconClick() {
        let datePicker = document.getElementById('due-date-hidden');
        datePicker.showPicker();
    }

    /**
     * Handles the change event on the date picker.
     * @param {Event} e - The change event object.
     * @return {void}
     */
    datePickerSelectionChange(e) {
        let newDateArr = String(e.target.value).split('-');
        let newDateString = `${newDateArr[2]}/${newDateArr[1]}/${newDateArr[0]}`;
        document.getElementById('due-date-display').value = newDateString;
        this.dateFieldOnChange();
    }

    /**
     * Handles the selection of a priority button in the Add Task form.
     * @param {HTMLElement} button - The priority button element.
     * @returns {void}
     */
    addTaskPrioritySelect(button) {
        if (!button) { return; }
        const buttonName = button.getAttribute('name');
        const isActiv = button.getAttribute('data-selected') == "true";
        this.currentPriority == buttonName && isActiv ? this.allPriortyButtonsReset() : this.setNewPriority(buttonName);
    }

    /**
     * Resets all priority buttons to their default state (not selected).
     * @returns {void}
     */
    allPriortyButtonsReset() {
        this.currentPriority = "";
        const btnContainer = document.getElementById('task-priority-button');
        if(!btnContainer){return;}
        const buttons = btnContainer.querySelectorAll('.btn');

        buttons.forEach((b) => {
            b.setAttribute('data-selected', 'false');
            this.setButtonStyleNotActiv(b);
        });
    }

    /**
     * Sets a new priority for the task.
     * @param {string} priority - The name of the priority to set.
     * @return {void}
     */
    setNewPriority(priority) {
        const btnContainer = document.getElementById('task-priority-button');
        const buttons = btnContainer.querySelectorAll('.btn');

        buttons.forEach((b) => {

            if (b.getAttribute('name') == priority) {
                b.setAttribute('data-selected', 'true');
                this.setButtonStyleActiv(b);

            } else {
                b.setAttribute('data-selected', 'false');
                this.setButtonStyleNotActiv(b);
            }

        });

        this.currentPriority = priority;

    }

    /**
     * Sets the button to the active state (selected).
     * @param {HTMLElement} button - The button element to activate.
     * @returns {void}
     */
    setButtonStyleActiv(button) {
        if (!button) { return; }
        button.classList.add(`prio-${button.getAttribute('data-name')}-selected`);
        this.togglePrioButtonTextColor(button, "white");
    }

    /**
     * Sets the button to the inactive state (not selected).
     * @param {HTMLElement} button - The button element to deactivate.
     * @returns {void}
     */
    setButtonStyleNotActiv(button) {
        if (!button) { return; }
        button.classList.remove(`prio-${button.getAttribute('data-name')}-selected`);
        this.togglePrioButtonTextColor(button, "black");
    }

    /**
     * Toggles the text color of the priority button.
     * @param {HTMLElement} button - The button element to modify.
     * @param {string} whiteOrBlack - The color to set the text to ("white" or "black").
     * @returns {void}
     */
    togglePrioButtonTextColor(button, whiteOrBlack) {
        if (!button) { return; }
        let btnText = button.querySelector('span');
        if (whiteOrBlack == "white") {
            btnText.classList.add('prio-selected');
        } else {
            btnText.classList.remove('prio-selected');
        }

    }

    /**
     * Shows or hides the contact selection input field.
     * @param {string} showOrHide - Determines whether to show or hide the contact list.
     * @return {void}
     */
    showAndHideContacts(showOrHide = "show") {
        this.setInputAndButtonOnclickFunctionForContacts(showOrHide);
        const inputField = document.getElementById('task-assign-to');
        if (showOrHide == "show") {
            inputField.value = "";
            inputField.focus();
            this.showContactListForSelect();
            this.renderHideIcon('show-hide-icon-contacts');
            this.showOrHideBadgeContainer("hide");
        } else {
            inputField.value = "Select contacts to assign";
            this.hideContactListForSelect();
            this.renderShowIcon('show-hide-icon-contacts');
            this.showOrHideBadgeContainer("show");
            inputField.blur();
        }
    }

    /**
     * Sets the onclick function for the input field and button for showing/hiding contacts.
     * @param {string} showOrHide - Determines whether to show or hide the contact list.
     * @returns {void}
     */
    setInputAndButtonOnclickFunctionForContacts(showOrHide){
        const buttonShowOhrHide = document.getElementById('show-and-hide-contacts');
        buttonShowOhrHide.setAttribute('onclick', (showOrHide == "show" ? `${this.currentInstance}.showAndHideContacts("hide")` : `${this.currentInstance}.showAndHideContacts("show")`));
        const inputField = document.getElementById('task-assign-to');
        inputField.setAttribute('onclick', (showOrHide == "show" ? `${this.currentInstance}.showAndHideContacts("hide")` : `${this.currentInstance}.showAndHideContacts("show")`));
    }

    /**
     * Renders the show icon for the contact selection.
     * @param {string} elementID - The ID of the element to modify.
     * @returns {void}
     */
    renderShowIcon(elementID) {
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
    renderHideIcon(elementID) {
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
    showContactListForSelect(currentContactList = []) {

        const contactListArray = currentContactList.length !== 0 ? currentContactList : this.contactAllListFromDB;
        if (contactListArray == null || contactListArray.length == 0) { return; }
        this.renderContactOptions(contactListArray);
        const contactListContainer = document.getElementById('contact-List-container');
        const contactList = document.getElementById('contact-List-for-task');
        const heightOfOneContact = 56;
        let heightOfContainer = (contactListArray.length <= 5 ? heightOfOneContact * contactListArray.length : heightOfOneContact * 5) + 25;
        contactListContainer.style.height = heightOfContainer + "px";
        contactList.style.height = (heightOfContainer - 27) + "px";
        contactList.style.marginTop = "28px";
        this.isContactListOpen = true;
        contactListContainer.classList.add("any-list-scroll");
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
     * @returns {void}
     */
    hideContactListForSelect() {
        const contactListContainer = document.getElementById('contact-List-container');
        const contactList = document.getElementById('contact-List-for-task');

        requestAnimationFrame(() => {
            contactListContainer.style.height = "0";
            contactList.style.height = "0";
            contactList.style.marginTop = "0";
        });

        contactList.innerHTML = "";
        this.isContactListOpen = false;
    }

    /**
     * Renders the contact options for selection.
     * Using TaskUtils to check if the contact is already assigned to the task.
     * If the contact is the current user, it indicates that in the display.
     * @param {Array} contactList
     * @return {void}
     */
    renderContactOptions(contactList) {
        let contactSelectElement = document.getElementById('contact-List-for-task');
        contactSelectElement.innerHTML = "";

        for (let i = 0; i < contactList.length; i++) {
            const isCurrentUser = this.currentUser && (this.currentUser === contactList[i]['id']);
            const currentContactAssigned = this.addTaskUtils.findContactInAssignList(contactList[i], this.currentContactAssignList);
            contactSelectElement.innerHTML += getContactListElement(contactList[i], currentContactAssigned, false, this.currentInstance, isCurrentUser);
        }
    }

    /**
     * Handles the selection of a contact button in the list.
     * Uses TaskUtils to check if the contact is available and toggles its selection state.
     * @param {HTMLElement} currentContactBtn - The button element representing the selected contact.
     * @returns {void}
     */
    contactButtonOnListSelect(currentContactBtn) {

        const contactID = currentContactBtn.getAttribute('id');
        if (!this.addTaskUtils.checkIfContactAvailable(contactID, this.contactAllListFromDB)) { return; }

        currentContactBtn.getAttribute('data-active') == "true" ?
            this.checkOutContact(currentContactBtn, contactID) : this.checkInContact(currentContactBtn, contactID);

    }

    /**
     * Adds the selected contact to the task and updates the UI accordingly.
     * Uses TaskUtils to manage the contact assignment list.
     * Changes the styling of the selected contact to indicate its selection.
     * @param {HTMLElement} currentContact
     * @param {string} contactID
     * @returns {void}
     */
    checkInContact(currentContact, contactID) {
        this.currentContactAssignList = this.addTaskUtils.contactAddToTask(contactID, this.contactAllListFromDB, this.currentContactAssignList);
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
     * @param {HTMLElement} currentContact
     * @param {string} contactID
     * @return {void}
     */
    checkOutContact(currentContact, contactID) {
        this.currentContactAssignList = this.addTaskUtils.contactRemoveFromTask(contactID, this.currentContactAssignList);
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
     * @returns {void}
     */
    filterContactFromInputValue(inputValue) {
        this.showContactListForSelect(this.addTaskUtils.filterContacts(inputValue, this.contactAllListFromDB));
    }

    /**
     * Shows or hides the badge container for assigned contacts.
     * @param {string} showOrHide
     * @returns {void}
     */
    showOrHideBadgeContainer(showOrHide = "") {
        if (showOrHide.length == 0) { return; }
        let container = document.getElementById('contact-assigned-badge');
        if (showOrHide == "show") {
            container.classList.remove('d-none');
            this.renderAsignedProfilBadge();
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
    renderAsignedProfilBadge() {
        if (this.currentContactAssignList.length == 0) {
            return;
        }

        let badgeContainer = document.getElementById('contact-assigned-badge');
        badgeContainer.innerHTML = "";
        let counter = 0;
        for (let i = 0; i < this.currentContactAssignList.length; i++) {
            badgeContainer.innerHTML += getAssignedContactBadge(this.currentContactAssignList[i]);
            counter++;
            if (counter == 4) { break; }
        }
    }

    /**
     * Shows or hides the category list for selection.
     * @param {string} showOrHide
     * @return {void}
     */
    showAndHideCategories(showOrHide = "show") {
        if (showOrHide == "show") {
            this.showCategoryListForSelect();
            this.setCategoryShowOrHideButton(showOrHide);
            this.renderHideIcon('show-hide-icon-category');
        } else {
            this.hideCategoryListForSelect();
            this.checkCategoryInputValue();
        }
    }

    /**
     * Shows the category list for selection.
     * If no categories are available, the function returns early.
     * Renders the category options and adjusts the height of the category list container based on the number of categories.
     * @returns {void}
     */
    showCategoryListForSelect() {
        if (this.categories == null || this.categories.length == 0) { return; }
        this.renderCategoryOptions(this.categories);
        const categoryListContainer = document.getElementById('category-list-container');
        const categoryList = document.getElementById('category-list-for-task');
        const heightOfOneCategory = document.getElementById(this.categories[0]['id']).offsetHeight;
        let heightOfContainer = heightOfOneCategory * this.categories.length + 40;
        categoryListContainer.style.height = heightOfContainer + "px";
        categoryList.style.height = (heightOfContainer - 27) + "px";
        this.setCategoryInputfieldValue('Select task category');
        this.currentCategory = {};
        this.isCategoryListOpen = true;
    }

    /**
     * Hides the category list for selection.
     * Uses `requestAnimationFrame` to smoothly collapse the category list container and the category list itself by setting their heights to zero.
     * @returns {void}
     */
    hideCategoryListForSelect() {
        const categoryListContainer = document.getElementById('category-list-container');
        const categoryList = document.getElementById('category-list-for-task');

        requestAnimationFrame(() => {
            categoryListContainer.style.height = "0";
            categoryList.style.height = "0";
        });

        categoryList.innerHTML = "";
        this.setCategoryShowOrHideButton('hide');
        this.renderShowIcon('show-hide-icon-category');
        this.isCategoryListOpen = false;
    }

    /**
     * Renders the category options for selection.
     * If no categories are available, the function returns early.
     * @param {Array} categories
     */
    renderCategoryOptions(categories) {
        let categorySelectElement = document.getElementById('category-list-for-task');
        categorySelectElement.innerHTML = "";

        for (let i = 0; i < categories.length; i++) {
            categorySelectElement.innerHTML += getCategoryListElement(categories[i], this.currentInstance);
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
     * @return {void}
     */
    categoryButtonOnListSelect(button) {
        if (!button) { showCategoryError(); }
        let indexOfCategory = this.addTaskUtils.getIndexOfObjectOfArray(button.getAttribute('id'), this.categories);
        if (indexOfCategory < 0) { showCategoryError(); }
        this.currentCategory = this.categories[indexOfCategory];
        this.hideCategoryListForSelect();
        this.setCategoryInputfieldValue(this.currentCategory['title']);
        this.checkCategoryInputValue();
    }

    /**
     * Sets the value of the category input field.
     * @param {string} value - The value to set in the category input field.
     * @return {void}
     */
    setCategoryInputfieldValue(value) {
        document.getElementById('task-category').value = value;
    }

    /**
     * Sets the onclick attribute for the show/hide button.
     * @param {string} showOrHide
     * @return {void}
     */
    setCategoryShowOrHideButton(showOrHide) {
        const buttonShowOrHide = document.getElementById('show-and-hide-categories');
        buttonShowOrHide.setAttribute('onclick', (showOrHide == "show" ? `${this.currentInstance}.showAndHideCategories("hide")` : `${this.currentInstance}.showAndHideCategories("show")`));
    }

    /**
     * Handles the click event on the category input field.
     * If the category list is open, it blurs the input field, hides the category list, and checks the input value.
     * If the category list is closed, it shows the category list.
     * @param {HTMLElement} inputField - The input field element for the category.
     * @return {void}
     */
    onclickCategoryInput(inputField) {
        if (this.isCategoryListOpen) {
            inputField.blur();
            this.hideCategoryListForSelect();
            this.checkCategoryInputValue();
        } else {
            this.showAndHideCategories('show');
        }
    }

    /**
     * Checks the value of the category input field for validity.
     * If the input field is empty or has the default placeholder value, it shows an error message and border.
     * If a valid category is selected, it hides the error message and border.
     * @returns void
     */
    checkCategoryInputValue() {
        let categoryInput = document.getElementById('task-category');
        if (!categoryInput) { return; }
        if (categoryInput.value == "Select task category") {
            this.showAndLeaveErrorMessage('a-t-category-required', true);
            this.showAndLeaveErrorBorder('task-category', true);
        } else {
            this.showAndLeaveErrorMessage('a-t-category-required', false);
            this.showAndLeaveErrorBorder('task-category', false);
        }

    }

    /**
     * Handles the click event on the subtask input field.
     * If the subtask writing buttons are not visible, it shows them.
     * If they are visible, it hides them.
     * @param {HTMLElement} input - The input field element for the subtask.
     * @returns void
     */
    onclickSubtaskInput(input) {
        if (!input) { return; }
        this.toggleSubWritingButtons(true);
    }

    /**
     * Toggles the visibility of the subtask writing buttons.
     * @param {boolean} visibility - Indicates whether to show or hide the subtask writing buttons.
     * @returns {void}
     */
    toggleSubWritingButtons(visibility) {
        let fieldButtons = document.getElementById('sub-writing-buttons');
        visibility ? fieldButtons.classList.remove('d-none') : fieldButtons.classList.add('d-none');
    }

    /**
     * Handles the pressing of the Enter key in the subtask input field.
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {HTMLElement} inputField - The subtask input field element.
     * @returns {void}
     */
    subtaskInputfieldPressEnter(event, inputField) {
        if (event.code == "Enter" || event.code == "NumpadEnter") {
            this.toggleSubWritingButtons(false);
            inputField.blur();
            this.adoptCurrentSubEntry();
        }
    }

    /**
     * Adopts the current subtask entry.
     * If the input field is empty or has less than 3 characters, it does nothing.
     * Otherwise, it adds the subtask to the current subtask list, clears the input field, and renders the subtasks.
     * Uses TaskUtils to manage the subtask list.
     * @returns void
     */
    adoptCurrentSubEntry() {
        let inputfield = document.getElementById('task-sub-task');
        if (!inputfield) { return; }
        const inputValueClean = (inputfield.value ?? "").trim();
        if (inputValueClean.length < 3) { return; }
        this.currentSubTasks = this.addTaskUtils.addSubtaskToArray(inputValueClean, this.currentSubTasks);
        this.clearSubInputField();
        this.renderSubtasks();
    }

    /**
     * Clears the subtask input field.
     * If the input field is not found, it does nothing.
     * Otherwise, it clears the input field, toggles the visibility of the subtask writing buttons, and removes focus from the input field.
     * @returns void
     */
    clearSubInputField() {
        let inputfield = document.getElementById('task-sub-task');
        if (!inputfield) { return; }
        inputfield.value = "";
        this.toggleSubWritingButtons(false);
        inputfield.blur();

    }

    /**
     * Deletes the currently selected subtask.
     * Uses TaskUtils to remove the subtask from the current subtask list.
     * Renders the updated list of subtasks.
     * @param {string} subtaskID - The ID of the subtask to delete.
     * @returns void
     */
    deleteCurrentSelectedSubTask(subtaskID) {
        this.currentSubTasks = this.addTaskUtils.removeSubtaskFromArray(subtaskID, this.currentSubTasks);
        this.renderSubtasks();
    }

    /**
     * Edits the currently selected subtask.
     * @param {string} subtaskID - The ID of the subtask to edit.
     * @returns void
     */
    editCurrentSelectedSubTask(subtaskID) {
        this.renderSubtasks(subtaskID);
    }

    /**
     * Renders the list of subtasks.
     * If there are no subtasks, it returns early.
     * If an ID for editing is provided, it renders that subtask in edit mode.
     * Otherwise, it renders all subtasks in read-only mode, showing only up to 3 subtasks for better UI.
     * @param {string} idForEdit - The ID of the subtask to edit.
     * @returns void
     */
    renderSubtasks(idForEdit = "") {
        let subTaskList = document.querySelector('.sub-task-list');
        subTaskList.innerHTML = "";
        if (this.currentSubTasks.length == 0) { return; }
        let counter = 0;
        if (!subTaskList) { return; }

        for (let i = 0; i < this.currentSubTasks.length; i++) {
            if (this.currentSubTasks[i]['id'] == idForEdit) {
                subTaskList.innerHTML += getSubtaskListElementForChanging(this.currentSubTasks[i], this.currentInstance);
                continue;
            }
            subTaskList.innerHTML += getSubtaskListElementReadOnly(this.currentSubTasks[i], this.currentInstance);
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
    safeChangesOnCurrentSelectedSubtask(subtaskID) {
        let currentSubTask = this.currentSubTasks.find(x => x['id'] == subtaskID);
        if (!currentSubTask) { return; }
        const inputField = document.getElementById(`subTaskEdit-${subtaskID}`);
        const inputValueClean = (inputField.value ?? "").trim();
        if (inputValueClean.length <= 3) { return; }
        currentSubTask['title'] = inputField.value;
        this.renderSubtasks();
    }

    /**
    * Clears the Add Task form by reloading the page.
    * This effectively resets all form fields and local data.
    * @returns {void}
    */
    addTaskFormClear() {
        location.reload();
    }


    /**
    * Handles the creation of a new task.
    * Prepares the data from the form and the local data to create a new task.
    * Uses the CreateNewTask class to handle the task creation process.
    * After the task is created, it shows a confirmation dialog and navigates to the board view.
    * @param {Event} event - The event object from the form submission.
    * @returns {Promise<void>}
     */
    async addTaskCreateTask(event) {

        if (event) event.preventDefault();
        const addTaskFormData = new FormData(event.currentTarget);
        
        const currentTask = new Task(
            getNewUid(),
            addTaskFormData.get('task-title'),
            addTaskFormData.get('task-description'),
            addTaskFormData.get('due-date'),
            this.currentPriority,
            this.currentCategory['id'],
            this.currentStateCategory 
        );

        const createNewTask = new CreateNewTask(currentTask, this.currentSubTasks, this.currentContactAssignList, this.currentUser);
        await createNewTask.start();
        this.addTaskAfterSafe(this.getIsDialog(), event);
    }

    /**
     * Checks if the add task form is in a dialog.
     * @returns {boolean} True if the form is in a dialog, false otherwise.
     */
    getIsDialog(){
        const forms = document.querySelectorAll('form');
        if (!forms) { return false; }

        let formAddTask;

        forms.forEach((form) => {
            if (form.hasAttribute('data-isDialog')) {
                formAddTask = form;
            }
        });

        if (!formAddTask) { return false; }

        const isDialog = formAddTask.getAttribute('data-isDialog');
        return isDialog === "true";
    }

    /**
    * Shows a confirmation dialog after a task is successfully added.
    * Closes the Add Task dialog if it was opened from a dialog view.
    * Navigates to the board view after the confirmation dialog is closed.
    * @param {boolean} fromDialog - Indicates if the call is from a dialog.
    * @returns {void}
    */
    addTaskAfterSafe(fromDialog = false) {
        this.toggleDialogDisplay();
        const dialog = document.getElementById('add-task-safe-dialog');
        dialog.classList.add('safe-dialog-show');
        dialog.showModal();
        setTimeout(function () {
            dialog.close();
            !fromDialog ? navigateToBoard() : closeTheDialog(null, 'add-task-dialog');
        }, 1800);
    }

    /**
     * Toggles the display of the Add Task confirmation dialog.
     * @return {void}
     */
    toggleDialogDisplay() {
        document.getElementById('add-task-safe-dialog').classList.toggle('visually-hidden');
    }


}