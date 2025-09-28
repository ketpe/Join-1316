/**
 * Utility class for managing tasks, contacts, and subtasks.
 * Provides methods for handling user IDs, contact assignments, and subtask management.
 */
class AddTaskUtils {

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

    measureTheRemainingSpaceOfFieldsForDesktop(aHeight){
        const headerHeight = document.querySelector(".header-desktop").offsetHeight;
        const footerHeight = document.querySelector(".add-task-footer").offsetHeight;
        const distanceButtom = 45;
        const addTaskHeader = document.querySelector(".add-task-head").offsetHeight;

        const res = aHeight - (headerHeight + footerHeight + distanceButtom + addTaskHeader + 24);
        return res;

    }
}