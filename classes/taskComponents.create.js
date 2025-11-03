/**
 * @description This file contains methods related to creating a new task.
 * It extends the TaskComponents class with functionalities for handling task creation,
 * including form submission, dialog management, and task data preparation.
 * Loaded by add task page
 * @see TaskComponents
 * @mixin taskComponents.create
 */

(function () {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * @description Gets the task details for submission.
     * @function getTaskDetails
     * @memberof taskComponents.create
     * @returns {Array} - The task details array.
     */
    Object.defineProperty(TaskComponents.prototype, "getTaskDetails", {
        get: function () {
            return [
                this.currentPriority,
                this.currentCategory['id'],
                this.currentSubTasks,
                this.currentContactAssignList
            ];
        }
    });

    /**
    * @description Clears the Add Task form by reloading the page.
    * This effectively resets all form fields and local data.
    * @function addTaskFormClear
    * @memberof taskComponents.create
    * @returns {void}
    */
    taskComponentsPrototype.addTaskFormClear = function() {
        location.reload();
    };

    /**
    * @description Handles the creation of a new task.
    * Prepares the data from the form and the local data to create a new task.
    * Uses the CreateNewTask class to handle the task creation process.
    * After the task is created, it shows a confirmation dialog and navigates to the board view.
    * @function addTaskCreateTask
    * @memberof taskComponents.create
    * @param {Event} event - The event object from the form submission.
    * @returns {Promise<void>}
     */
    taskComponentsPrototype.addTaskCreateTask = async function(event) {

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
     * @description Checks if the add task form is in a dialog.
     * @function getIsDialog
     * @memberof taskComponents.create
     * @returns {boolean} True if the form is in a dialog, false otherwise.
     */
    taskComponentsPrototype.getIsDialog = function() {
        const forms = document.querySelectorAll('form');
        if (!forms) { return false; }

        let formAddTask;

        forms.forEach((form) => {
            if (form.hasAttribute('data-isDialog')) {formAddTask = form;}
        });

        if (!formAddTask) { return false; }

        const isDialog = formAddTask.getAttribute('data-isDialog');
        return isDialog === "true";
    };

    /**
    * @description Shows a confirmation dialog after a task is successfully added.
    * Closes the Add Task dialog if it was opened from a dialog view.
    * Navigates to the board view after the confirmation dialog is closed.
    * @function addTaskAfterSafe
    * @memberof taskComponents.create
    * @param {boolean} fromDialog - Indicates if the call is from a dialog.
    * @returns {void}
    */
    taskComponentsPrototype.addTaskAfterSafe = function (fromDialog = false) {
        this.toggleDialogDisplay();
        const dialog = document.getElementById('add-task-safe-dialog');
        dialog.classList.add('safe-dialog-show');
        dialog.showModal();
        setTimeout(function () {
            dialog.close();
            !fromDialog ? navigateToBoard() : closeTheDialog(null, 'add-task-dialog');
        }, 1800);
    };

    /**
     * @description Toggles the display of the Add Task confirmation dialog.
     * @function toggleDialogDisplay
     * @memberof taskComponents.create
     * @return {void}
     */
    taskComponentsPrototype.toggleDialogDisplay = function() {
        document.getElementById('add-task-safe-dialog').classList.toggle('visually-hidden');
    };

    /**
    * @description Handles mouse click events within the Add Task window.
    * Closes the contact and category selection lists if the click occurs outside of them.
    * @function addTaskWindowMouseClick
    * @memberof taskComponents.create
    * @param {MouseEvent} e - The mouse event object.
    * @returns {void}
    */
    taskComponentsPrototype.addTaskWindowMouseClick = function(e) {

        if (!e.target.closest(".contact-select-container") && !e.target.closest(".contact-List-container") && this.isContactListOpen) {
            this.isContactListOpen = false;
            this.showAndHideContacts("hide");
        }

        if (!e.target.closest('.category-select-container') && !e.target.closest('.category-list-container') && this.isCategoryListOpen) {
            this.isCategoryListOpen = false;
            this.showAndHideCategories('hide');
        }
    };

    /**
     * @description Reads the current task date into variables.
     * @function readCurrentTaskDateIntoVariables
     * @memberof taskComponents.create
     * @returns {void}
     */
    taskComponentsPrototype.readCurrentTaskDateIntoVariables = function() {
        this.currentSubTasks = this.currentTask['subTasks'];
        this.currentDueDate = this.currentTask['dueDate'];
        this.currentTitle = this.currentTask['title'];
        this.currentCategory = this.currentTask['categoryData'];
    };

})();