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
     * Limits the display to a maximum of three contacts and adjusts the container height accordingly.
     * @returns {void}
     */
    viewAssignedContacts() {
        let counter = 0;
        let contactSelectElement = document.getElementById('contact-List-for-task');
        contactSelectElement.innerHTML = "";
        for (let i = 0; i < this.currentTask.assignedContacts.length; i++) {
            if(this.currentTask.assignedContacts[i].length == 0){continue;}
            contactSelectElement.innerHTML += getContactListElement(this.currentTask.assignedContacts[i][0], false, true, this.currentInstance, 
                this.checkIfCurrentUserIsAssigned(this.currentTask.assignedContacts[i][0]['id']));
            counter++;
            if (counter >= 3) { break; }
        }
        const heightOfOneContact = 52;
        let heightOfContainer = (this.currentTask.assignedContacts.length <= 3 ?
            heightOfOneContact * this.currentTask.assignedContacts.length : heightOfOneContact * 3);

        contactSelectElement.style.height = (heightOfContainer) + "px";
    }

    /**
     * @description Checks if the current user is assigned to the task.
     * @function checkIfCurrentUserIsAssigned
     * @memberof BoardTaskDetailViewUtils
     * @param {string} contactID 
     * @returns Boolean indicating if the current user is assigned to the task
     */
    checkIfCurrentUserIsAssigned(contactID){
        const currentUser = getLogStatus();
        if(!currentUser){ return false; }
        if(currentUser == "guest"){ return false; }
        return currentUser == contactID;
    }

    /**
     * Renders the subtask information in the dialog.
     * @returns {void}
     */
    viewSubTasks(){
        let subTaskContainer = document.getElementById('detail-view-subtask-container');
        for(let i = 0; i < this.currentTask.subTasks.length; i++){
            subTaskContainer.innerHTML += getSubtaskForDetailView(this.currentTask.subTasks[i]);
        }

        subTaskContainer.style.height = (this.currentTask.subTasks.length * 28) + "px";
    }

    /**
     * Retrieves the current height of the task main container.
     * @returns {number} The current height of the task main container.
     */
    getCurrentHeight(){
        return document.querySelector(".task-main").offsetHeight;
    }

    /**
     * Sets the dialog height based on the current main container height.
     * @param {number} currentMainHeight - The current height of the main container.
     * @returns {void}
     */
    setDialogHeight(currentMainHeight){
        let taskMain = document.querySelector(".task-main");
        if(currentMainHeight <= 615){
            taskMain.style.height = currentMainHeight + "px";
        }else{
            taskMain.style.height = "615px";
            taskMain.classList.add('task-main-scroll');
        }
    }

    /**
     * Sets the current task ID into the edit and delete buttons for reference.
     * @returns {void}
     */
    setTaskIDIntoButtons(){
        document.getElementById('detail-view-delete-btn').setAttribute('data-id', `${this.currentTaskID}`);
        document.getElementById('detail-view-edit-btn').setAttribute('data-id', `${this.currentTaskID}`);
    }

}
