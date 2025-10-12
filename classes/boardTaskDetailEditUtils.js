/**
 * Class for rendering and managing the edit view of a task in the board detail view.
 * Handles loading the edit HTML, rendering components, and setting up event listeners.
 */

class BoardTaskDetailEditUtils{

    /**
     * Creates an instance of the BoardTaskDetailEditUtils class.
     * @param {string} currentTaskID - The ID of the current task.
     * @param {Object} currentTask - The current task object.
     * @param {Object} currentInstance - The current instance of the task.
     */
    constructor(currentTaskID, currentTask, currentInstance){
        this.currentTask = currentTask;
        this.currentTaskID = currentTaskID;
        this.currentInstance = currentInstance;
    }

    /**
     * Initiates the rendering process for the task edit view.
     * Cleans the dialog, loads the edit HTML, renders components, and sets up onclick events.
     */
    async startRenderTaskEdit(){
        this.cleanDialog();
        await this.loadEditHtmlIntoDialog();
        this.renderEditComponents();
        const addTaskUtils = new AddTaskUtils();
        addTaskUtils.setAddTaskCreateBtnMouseFunction('detail-edit-ok-btn', this.currentInstance);

    }

    /**
     * Cleans the dialog content area.
     */
    cleanDialog(){
        document.getElementById('dialog-content-detail-view-task').innerHTML = "";
    }

    /**
     * Loads the HTML template for the task edit view into the dialog content area.
     */
    async loadEditHtmlIntoDialog(){
        await includeHtml("dialog-content-detail-view-task", "taskEditTemplate.html");
    }

    /**
     * Renders the edit components for the task.
     */
    renderEditComponents(){
        let mainConatiner = document.querySelector('.task-edit-fields');
        let taskComponents = new TaskElements(this.currentInstance);
        mainConatiner.innerHTML += taskComponents.getTitleComponent(false, this.currentTask['title']);
        mainConatiner.innerHTML += taskComponents.getDescriptionComponents(this.currentTask['description'], true);
        mainConatiner.innerHTML += taskComponents.getDueDateComponents(false, this.currentTask['dueDate']);
        mainConatiner.innerHTML += taskComponents.getPrioButtonComponents();
        mainConatiner.innerHTML += taskComponents.getContactComponents();
        mainConatiner.innerHTML += taskComponents.getAssignedBadges();
        mainConatiner.innerHTML += taskComponents.getSubTaskComponents();
        mainConatiner.innerHTML += taskComponents.getSubtaskListContainer();
    }

    /**
     * Gets the current assigned contact list from the task.
     * @returns {Array} The list of currently assigned contacts.
     */
    getCurrentAssignList(){
        let contacts = [];

        for(let i = 0; i < this.currentTask.assignedContacts.length; i++){
            contacts.push(this.currentTask.assignedContacts[i][0]);
        }

        return contacts;
    }
}