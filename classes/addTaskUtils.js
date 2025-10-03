/**
 * Utility class for managing tasks, contacts, and subtasks.
 * Provides methods for handling user IDs, contact assignments, and subtask management.
 */
class AddTaskUtils {

    static _addTaskCache = {
        formData: { title: "", description: "", dueDate: "", priority: "Medium" },
        category: null, 
        assignedContacts: [],
        subTasks: []
    };


    static getAddTaskCache(){
        return this._addTaskCache;
    }

    static setAddTaskCache(patch){
        this._addTaskCache = {...this._addTaskCache, ...patch};
    }


    static captureCurrentAddTaskDataFromView(){

        if(!this.checkNodyIsNotEmpty()){return;}

        const {titleElement, descriptionElement, dueDateElement} = this.captureInputFields();

        const prioButtonsContainer = document.getElementById('task-priority-button');
        const selectedPrioButton = prioButtonsContainer?.querySelector('.btn[data-selected="true"]');
        const priority = selectedPrioButton?.getAttribute('name') || this._addTaskCache.formData.priority || "Medium";

        //Eventuell Fallstrick!
        const components = window.addTasktaskComponents;
        const category = components?.currentCategory?.id ? components.currentCategory : this._addTaskCache.category;
        const assignedContacts = components?.currentContactAssignList || this._addTaskCache.assignedContacts;
        const subTasks = components?.currentSubTasks || this._addTaskCache.subTasks;
        
        this.setAddTaskCache({
            formData: {
                title: (titleElement?.value ?? "").trim(),
                description: (descriptionElement?.value ?? "").trim(),
                dueDate: (dueDateElement?.value ?? "").trim(),
                priority: priority
            },
            category,
            assignedContacts: Array.isArray(assignedContacts) ? [...assignedContacts] : [],
            subTasks: Array.isArray(subTasks) ? [...subTasks] : []
        });
    }

    static checkNodyIsNotEmpty(){
        return document.body && document.body.children.length > 0 ? true : false;
    }

    static applyAddTaskDataToView(components){
        if(!components){return;}
        const {formData, category, assignedContacts, subTasks} = this._addTaskCache;

        components.currentTitle = formData.title;
        components.currentDueDate = formData.dueDate || "";
        components.currentPriority = formData.priority || "Medium";
        components.currentCategory = category || {};
        components.currentContactAssignList = Array.isArray(assignedContacts) ? [...assignedContacts] : [];
        components.currentSubTasks = Array.isArray(subTasks) ? [...subTasks] : [];

        this.applyFormDataIntoInputFields(formData);

        components.setNewPriority(formData.priority || "Medium");

        this.applyCategoryToView(category, components);

        components.showOrHideBadgeContainer('show');
        components.renderSubtasks();

        const btn = document.getElementById('createTaskButton');
        components.addTaskCheckRequiredField(btn);

    }

    static applyFormDataIntoInputFields(formData){
        const {titleElement, descriptionElement, dueDateElement} = this.captureInputFields();
        if(titleElement){titleElement.value = formData.title || "";}
        if(descriptionElement){descriptionElement.value = formData.description || "";}
        if(dueDateElement){dueDateElement.value = formData.dueDate || "";}
    }


    static applyCategoryToView(category, components){
        if(category?.title){
            components.setCategoryInputfieldValue(category.title);
            components.showAndLeaveErrorMessage('a-t-category-required', false);
            components.showAndLeaveErrorBorder('task-category', false);
        }else{
            components.setCategoryInputfieldValue('Select task category');
        }
    }

    static captureInputFields(){
        const titleElement = document.getElementById('task-title');
        const descriptionElement = document.getElementById('task-description');
        const dueDateElement = document.getElementById('due-date-display');

        return {titleElement, descriptionElement, dueDateElement};
    }


    constructor() { }

    /**
     * Retrieves the current user ID from session storage.
     * @returns {string} Current User ID from session storage
     */
    readCurrentUserID() {
        return sessionStorage.getItem('logInStatus');
    }

    /**
     * Checks if the current user is a guest.
     * @returns {boolean} True if the current user is a guest, false otherwise.
     */
    isCurrentUserGuest() {
        return sessionStorage.getItem('logInStatus') == "0";
    }

    /**
     * Finds a contact in the assigned list.
     * @param {Object} contact - The contact object to find.
     * @param {Array} currentContactAssignList - The list of currently assigned contacts.
     * @returns {boolean} True if the contact is found in the assigned list, false otherwise.
     */
    findContactInAssignList(contact, currentContactAssignList) {
        if (currentContactAssignList.length == 0) { return false; }
        return this.getIndexOfObjectOfArray(contact['id'], currentContactAssignList) != -1;
    }

    /**
     * Checks if a contact is available in the database.
     * @param {string} currentContactID - The ID of the contact to check.
     * @param {Array} contactAllListFromDB - The list of all contacts from the database.
     * @returns {boolean} True if the contact is available, false otherwise.
     */
    checkIfContactAvailable(currentContactID, contactAllListFromDB) {
        return this.getIndexOfObjectOfArray(currentContactID, contactAllListFromDB) != -1;
    }

    /**
     * Adds a contact to the task's assigned list.
     * @param {string} currentContactID - The ID of the contact to add.
     * @param {Array} contactAllListFromDB - The list of all contacts from the database.
     * @param {Array} currentContactAssignList - The list of currently assigned contacts.
     * @returns {Array} The updated list of assigned contacts.
     */
    contactAddToTask(currentContactID, contactAllListFromDB, currentContactAssignList) {
        const indexOfContact = this.getIndexOfObjectOfArray(currentContactID, contactAllListFromDB);
        if (indexOfContact > -1) {
            currentContactAssignList.push(contactAllListFromDB[indexOfContact]);
        }
        return currentContactAssignList;
    }

    /**
     * Removes a contact from the task's assigned list.
     * @param {string} currentContactID - The ID of the contact to remove.
     * @param {Array} currentContactAssignList - The list of currently assigned contacts.
     * @returns {Array} The updated list of assigned contacts.
     */
    contactRemoveFromTask(currentContactID, currentContactAssignList) {
        const indexOfContact = this.getIndexOfObjectOfArray(currentContactID, currentContactAssignList);
        if (indexOfContact > -1) {
            currentContactAssignList.splice(indexOfContact, 1);
        }
        return currentContactAssignList;
    }

    /**
     * Gets the index of an object in an array by its ID.
     * @param {string} objectID - The ID of the object to find.
     * @param {Array} objectArray - The array to search in.
     * @returns {number} The index of the object in the array, or -1 if not found.
     */
    getIndexOfObjectOfArray(objectID, objectArray) {

        let objectFind = objectArray.find(x => x['id'] == objectID);
        if (objectFind == null) { return -1; }
        return objectArray.indexOf(objectFind);
    }

    /**
     * Filters contacts based on the input value.
     * @param {string} inputValue - The value to filter contacts by.
     * @param {Array} contactAllListFromDB - The list of all contacts from the database.
     * @returns {Array} The filtered list of contacts.
     */
    filterContacts(inputValue, contactAllListFromDB) {
        const inputCleanValue = (inputValue ?? "").trim();
        if (inputCleanValue.length < 2) { return contactAllListFromDB; }
        return contactAllListFromDB.filter((c) => c['firstname'].toLowerCase().startsWith(inputCleanValue.toLowerCase()));
    }

    /**
     * Adds a subtask to the current list of subtasks.
     * @param {string} subTaskEntry - The title of the subtask to add.
     * @param {Array} currentSubTasks - The list of currently existing subtasks.
     * @returns {Array} The updated list of subtasks.
     */
    addSubtaskToArray(subTaskEntry, currentSubTasks) {

        const position = currentSubTasks.length != 0 ? this.getMaxPositionOfSubtasks(currentSubTasks) + 1 : 0;

        const newSubTask = {
            'id': getNewUid(),
            'title': subTaskEntry,
            'taskChecked': false,
            'position': position
        };

        currentSubTasks.push(newSubTask);
        return currentSubTasks;
    }

    /**
     * Gets the maximum position of subtasks.
     * @param {Array} currentSubTasks - The list of current subtasks.
     * @returns {number} The maximum position of the subtasks.
     */
    getMaxPositionOfSubtasks(currentSubTasks) {
        if (currentSubTasks.length === 0) {
            return 0;
        } else {
            const firstSubstak = currentSubTasks[0];
            if (!firstSubstak.hasOwnProperty('position')) { return 0; }
        }
        const positions = currentSubTasks.map(s => s['position']).filter(p => typeof p === 'number' && !isNaN(p));
        if (positions.length === 0) { return 0; }
        const maxPosition = Math.max(...positions);
        return maxPosition;
    }

    /**
     * Removes a subtask from the current list of subtasks.
     * @param {string} subtaskID - The ID of the subtask to remove.
     * @param {Array} currentSubTasks - The list of currently existing subtasks.
     * @returns {Array} The updated list of subtasks.
     */
    removeSubtaskFromArray(subtaskID, currentSubTasks) {
        let indexOfSubtask = this.getIndexOfObjectOfArray(subtaskID, currentSubTasks);
        if (indexOfSubtask < 0) { return currentSubTasks; }
        currentSubTasks.splice(indexOfSubtask, 1);
        return currentSubTasks;
    }

    setAddTaskCreateBtnMouseFunction(buttonID, currentInstanceName) {
        const btn = document.getElementById(buttonID);
        if (!btn) { return; }
        btn.setAttribute('onmouseover', `${currentInstanceName}.addTaskSubmitOnMouse(this)`);
    }


    getElementsForDesktop() {
        const header = document.querySelector(".header-desktop");
        const footer = document.querySelector(".add-task-footer");
        const addTaskHeader = document.querySelector(".add-task-head");
        if (header && footer && addTaskHeader){
            return {header, footer, addTaskHeader};
        }

        return null;
    }

    getElementsForMobile(){
        const header = document.querySelector(".top-container-mobile");
        const footer = document.querySelector(".buttom-container-mobile");
        const addTaskHeader = document.querySelector(".add-task-head-mobile");

        if(header && footer && addTaskHeader){
            return {header, footer, addTaskHeader};
        }

        return null;
    }

    getElementsForDesktopSingle(){
        const header = document.querySelector(".header-desktop");
        const addTaskHeader = document.querySelector(".add-task-head-mobile");
        const footer = null;

        if(header && addTaskHeader){
            return {header, footer, addTaskHeader}
        }

        return null;
    }

    calculateSpaceForFields(aHeight, distanceFromButtom, {header, footer, addTaskHeader}){
        const headerHeight = header.offsetHeight;
        const footerHeight = footer?.offsetHeight || 0;
        const addTaskHeight = addTaskHeader.offsetHeight;
        return aHeight - (headerHeight + footerHeight + addTaskHeight + distanceFromButtom + 24);
    }

    
    measureTheRemainingSpaceOfFieldsForDesktop(aHeight) {
        return this.measureWithRetry(
            aHeight, 
            (addTaskU) => addTaskU.getElementsForDesktop(),
            45,
            3,
            100
        );
    }

    measureTheRemainingSpaceOfFieldsForDesktopSingle(aHeight){
        return this.measureWithRetry(
            aHeight,
            (addTaskU) => addTaskU.getElementsForDesktopSingle(),
            95,
            3,
            100
        );
    }

    
    measureTheRemainingSpaceOfFieldsForMobile(aHeight) {
        return this.measureWithRetry(
            aHeight,
            (addTaskU) => addTaskU.getElementsForMobile(),
            95,
            3,
            100
        );
    }

    measureWithRetry(aHeight, getElementsFunction, offset, retries = 3, delay = 100){
        return new Promise((resolve) => {
            let counter = 0;

            function tryCalculate(){
                const addTaskU = new AddTaskUtils();
                const elements = getElementsFunction(addTaskU);

                if(elements){
                    resolve(addTaskU.calculateSpaceForFields(aHeight, offset, elements));
                } else if(counter < retries){
                    counter++;
                    setTimeout(tryCalculate, delay);
                }
            }

            tryCalculate();
        });
    }

    

}