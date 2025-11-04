/**
 * @description Base class for task components, providing common properties and methods.
 * This class serves as a foundation for managing task-related functionalities,
 * including loading contacts and categories, setting priorities, and handling task data.
 * Loaded by add task page and board detail view page
 * @class TaskComponents
 * @namespace taskComponents
 * @mixes taskComponents.categories
 * @mixes taskComponents.contacts
 * @mixes taskComponents.create
 * @mixes taskComponents.layout
 * @mixes taskComponents.priority
 * @mixes taskComponents.subtasks
 * @mixes taskComponents.validation
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
    currentUser; 
    currentInstance; 
    currentStateCategory;


    /**
     * Creates an instance of the TaskComponents class.
     * @param {*} currentUser 
     * @param {*} currentInstance 
     * @param {*} currentStateCategory 
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
        //this.checkAvailableSpaceInAddTaskDialog();
        //this.checkAvailableSpaceInAddTask();
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


}