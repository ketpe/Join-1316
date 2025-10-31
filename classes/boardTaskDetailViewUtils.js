/**
 * This file contains the BoardTaskDetailViewUtils class which provides utility functions to render and manage task details in a board view.
 * It includes methods to display task information, handle assigned contacts, and manage subtasks.
 * It also includes helper functions to generate HTML elements for contacts, categories, and subtasks.
 * The class is designed to work with a task management application, facilitating the display and interaction with task details in a user-friendly manner.
 * Loaded by board detail view page
 * @class BoardTaskDetailViewUtils
 * @property {string} currentTaskID - The ID of the current task.
 * @property {Object} currentTask - The current task object.
 * @property {Object} currentInstance - The current instance of the task.
 */

class BoardTaskDetailViewUtils {

    currentTask;

    /** 
     * Creates an instance of the BoardTaskDetailViewUtils class.
     * @param {string} currentTaskID - The ID of the current task.
     * @param {Object} currentTask - The current task object.
     * @param {Object} currentInstance - The current instance of the task.
     */
    constructor(currentTaskID, currentTask, currentInstance) {
        this.currentTaskID = currentTaskID;
        this.currentTask = currentTask;
        this.currentInstance = currentInstance;
    }

    /**
     * Starts the rendering of task details in the dialog.
     * @returns {void}
     */
    startRenderTaskDetails() {
        if (this.currentTask == null) { return; }
        this.viewCategory();
        this.viewTextInDialog('user-story', this.currentTask.categoryData.title);
        this.viewTextInDialog('task-title', this.currentTask['title']);
        this.viewTextInDialog('task-description', this.currentTask['description']);
        this.viewTextInDialog('task-due-date', this.currentTask['dueDate']);
        this.viewTextInDialog('priority-text', this.currentTask['priority']);
        this.viewPriority();
        this.viewAssignedContacts();
        this.viewSubTasks();
        this.setTaskIDIntoButtons();
    }

    /**
     * Retrieves the current task object.
     * @returns {Object|null} The current task object or null if not found.
     */
    getCurrentTask() {
        const taskFilter = this.tasksArray.filter(x => x['id'] == this.currentTaskID);
        if (taskFilter.length > 0) {
            this.currentTask = taskFilter[0];
        }
    }

    /**
     * Renders the category information in the dialog.
     * @returns {void}
     */
    viewCategory() {
        let catElement = document.getElementById('left-header');
        if (!catElement) { return; }
        catElement.classList.add(this.currentTask.categoryData.categoryColor);
    }

    /**
     * Updates the text content of a specified element in the dialog.
     * @param {string} elementID - The ID of the element to update.
     * @param {string} textValue - The new text value to set.
     * @returns {void}
     */
    viewTextInDialog(elementID, textValue) {
        let element = document.getElementById(elementID);
        if (!element) { return; }
        element.innerHTML = textValue;
    }

    /**
     * Renders the priority information in the dialog.
     * @returns {void}
     */
    viewPriority() {
        let prioIconElement = document.querySelector('.priority-indicator div');
        if (!prioIconElement) { return; }
        const cuurentIconClass = this.currentTask['priority'] == "Urgent" ? "priority-icon-Urgent" :
            this.currentTask['priority'] == "Medium" ? "priority-icon-Medium" : "priority-icon-Low";
        prioIconElement.classList.add(cuurentIconClass);
    }

    /**
     * Renders the assigned contacts in the dialog.
     * Adjusts the container height accordingly.
     * @returns {void}
     */
    viewAssignedContacts() {
        let counter = 0;
        let contactSelectElement = document.getElementById('contact-List-for-task');
        contactSelectElement.innerHTML = "";
        for (let i = 0; i < this.currentTask.assignedContacts.length; i++) {
            if (this.currentTask.assignedContacts[i].length == 0) { continue; }
            contactSelectElement.innerHTML += getContactListElement(this.currentTask.assignedContacts[i][0], false, true, this.currentInstance,
                this.checkIfCurrentUserIsAssigned(this.currentTask.assignedContacts[i][0]['id']));
            counter++;
        }
        const heightOfOneContact = this.getOffsetHeightOfElement('.contact-list-btn') ? this.getOffsetHeightOfElement('.contact-list-btn') + 1 : 55;
        let heightOfContainer = heightOfOneContact * this.currentTask.assignedContacts.length;
        contactSelectElement.style.height = (heightOfContainer) + "px";
    }

    /**
     * @description Checks if the current user is assigned to the task.
     * @function checkIfCurrentUserIsAssigned
     * @memberof BoardTaskDetailViewUtils
     * @param {string} contactID 
     * @returns Boolean indicating if the current user is assigned to the task
     */
    checkIfCurrentUserIsAssigned(contactID) {
        const currentUser = getLogStatus();
        if (!currentUser) { return false; }
        if (currentUser == "guest") { return false; }
        return currentUser == contactID;
    }

    /**
     * Renders the subtask information in the dialog.
     * @returns {void}
     */
    viewSubTasks() {
        let subTaskContainer = document.getElementById('detail-view-subtask-container');
        const subtaskArray = this.getSortedSubTask();
        for (let i = 0; i < subtaskArray.length; i++) {
            subTaskContainer.innerHTML += getSubtaskForDetailView(subtaskArray[i]);
        }
        const heightOfOneSubtask = this.getOffsetHeightOfElement('.subtask-content') ? this.getOffsetHeightOfElement('.subtask-content') : 36;
        subTaskContainer.style.height = (subtaskArray.length * heightOfOneSubtask) + "px";
    }

  
    /**
     * Retrieves the offset height of a specified element.
     * @param {string} elementMarker - The CSS selector for the element.
     * @returns {number} The offset height of the element, or 0 if not found.
     */
    getOffsetHeightOfElement(elementMarker) {
        let element = document.querySelector(elementMarker);
        return element ? element.offsetHeight : 0;
    }

    /**
     * Retrieves the sorted subtask array.
     * @returns {Array} The sorted subtask array.
     */
    getSortedSubTask() {
        if (!this.currentTask.subTasks || this.currentTask.subTasks.length == 0) { return []; }
        const sortedSubTasks = this.currentTask.subTasks.sort((a, b) => a.position - b.position);
        return sortedSubTasks;
    }


    /**
     * Sets the current task ID into the edit and delete buttons for reference.
     * @returns {void}
     */
    setTaskIDIntoButtons() {
        document.getElementById('detail-view-delete-btn').setAttribute('data-id', `${this.currentTaskID}`);
        document.getElementById('detail-view-edit-btn').setAttribute('data-id', `${this.currentTaskID}`);
    }

    /**
     * Measures the current dialog content height.
     * @returns {Array} - An array containing the header, main content, and footer heights.
     */
    measureCurrentDialogContentHeight() {
        const headerHeight = this.getOffsetHeightOfElement('.task-header');
        const footerHeight = this.getOffsetHeightOfElement('footer.task-detailview-actions') + 24;
        const mainContentHeight = this.getOffsetHeightOfElement('main.task-main');
        return [headerHeight, mainContentHeight, footerHeight];
    }

}
