/**
 * @description Subtask related methods for TaskComponents class.
 * This mixin provides functionalities to manage subtasks within a task,
 * including adding, removing, and rendering subtasks.
 * @mixin taskComponents.subtasks
 * @see TaskComponents
 */

(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * @description Handles the click event on the subtask input field.
     * If the subtask writing buttons are not visible, it shows them.
     * If they are visible, it hides them.
     * Reset all subtasks to non-edit mode.
     * @function onclickSubtaskInput
     * @memberof taskComponents.subtasks
     * @param {HTMLElement} input - The input field element for the subtask.
     * @returns {void}
     */
    taskComponentsPrototype.onclickSubtaskInput = function(input) {
        if (!input) { return; }
        this.renderSubtasks("", true);
        this.toggleSubWritingButtons(true);

    };

    /**
     * @description Toggles the visibility of the subtask writing buttons.
     * @function toggleSubWritingButtons
     * @memberof taskComponents.subtasks
     * @param {boolean} visibility - Indicates whether to show or hide the subtask writing buttons.
     * @returns {void}
     */
    taskComponentsPrototype.toggleSubWritingButtons = function(visibility) {
        let fieldButtons = document.getElementById('sub-writing-buttons');
        visibility ? fieldButtons.classList.remove('d-none') : fieldButtons.classList.add('d-none');
    };

    /**
     * @description Handles the pressing of the Enter key in the subtask input field.
     * @function subtaskInputfieldPressEnter
     * @memberof taskComponents.subtasks
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {HTMLElement} inputField - The subtask input field element.
     * @returns {void}
     */
    taskComponentsPrototype.subtaskInputfieldPressEnter = function(event, inputField) {
        if (event.code == "Enter" || event.code == "NumpadEnter") {
            this.toggleSubWritingButtons(false);
            inputField.blur();
            this.adoptCurrentSubEntry();
        }
    };

    /**
     * @description Adopts the current subtask entry.
     * If the input field is empty or has less than 3 characters, it does nothing.
     * Otherwise, it adds the subtask to the current subtask list, clears the input field, and renders the subtasks.
     * Uses TaskUtils to manage the subtask list.
     * Checks the available space in the add task dialog and the add task view after adding the subtask.
     * Change the Height of the right container if needed.
     * @function adoptCurrentSubEntry
     * @memberof taskComponents.subtasks
     * @returns {void}
     */
    taskComponentsPrototype.adoptCurrentSubEntry = function() {
        let inputfield = document.getElementById('task-sub-task');
        if (!inputfield) { return; }
        const inputValueClean = (inputfield.value ?? "").trim();
        if (inputValueClean.length < 3) { return; }
        this.currentSubTasks = this.addTaskUtils.addSubtaskToArray(inputValueClean, this.currentSubTasks);
        this.clearSubInputField();
        this.renderSubtasks();
        //this.checkAvailableSpaceInAddTaskDialog();
        //this.checkAvailableSpaceInAddTask();
    };

    /**
     * @description Clears the subtask input field.
     * If the input field is not found, it does nothing.
     * Otherwise, it clears the input field, toggles the visibility of the subtask writing buttons, and removes focus from the input field.
     * @function clearSubInputField
     * @memberof taskComponents.subtasks
     * @returns {void}
     */
    taskComponentsPrototype.clearSubInputField = function() {
        let inputfield = document.getElementById('task-sub-task');
        if (!inputfield) { return; }
        inputfield.value = "";
        this.toggleSubWritingButtons(false);
        inputfield.blur();

    };

    /**
     * @description Deletes the currently selected subtask.
     * Uses TaskUtils to remove the subtask from the current subtask list.
     * Renders the updated list of subtasks.
     * @function deleteCurrentSelectedSubTask
     * @memberof taskComponents.subtasks
     * @param {string} subtaskID - The ID of the subtask to delete.
     * @returns {void}
     */
    taskComponentsPrototype.deleteCurrentSelectedSubTask = function(subtaskID) {
        this.currentSubTasks = this.addTaskUtils.removeSubtaskFromArray(subtaskID, this.currentSubTasks);
        this.renderSubtasks();
    };

    /**
     * @description Edits the currently selected subtask.
     * @function editCurrentSelectedSubTask
     * @memberof taskComponents.subtasks
     * @param {string} subtaskID - The ID of the subtask to edit.
     * @returns {void}
     */
    taskComponentsPrototype.editCurrentSelectedSubTask = function(subtaskID) {
        this.renderSubtasks(subtaskID);
    };

    /**
     * @description Edits the currently selected subtask.
     * @function editCurrentSelectedSubTask
     * @memberof taskComponents.subtasks
     * @param {string} subtaskID - The ID of the subtask to edit.
     * @returns {void}
     */
    taskComponentsPrototype.editCurrentSelectedSubTask = function(subtaskID) {
        this.renderSubtasks(subtaskID);
    };

    /**
     * @description Safely applies changes to the currently selected subtask.
     * If the subtask is not found, it does nothing.
     * If the input value is less than or equal to 3 characters, it does nothing.
     * Otherwise, it updates the subtask title and re-renders the subtasks.
     * @function safeChangesOnCurrentSelectedSubtask
     * @memberof taskComponents.subtasks
     * @param {string} subtaskID - The ID of the subtask to edit.
     * @returns {void}
     */
    taskComponentsPrototype.safeChangesOnCurrentSelectedSubtask = function(subtaskID) {
        let currentSubTask = this.currentSubTasks.find(x => x['id'] == subtaskID);
        if (!currentSubTask) { return; }
        const inputField = document.getElementById(`subTaskEdit-${subtaskID}`);
        const inputValueClean = (inputField.innerText ?? "").trim();
        if (inputValueClean.length <= 2) { return; }
        currentSubTask['title'] = inputField.innerText;
        this.renderSubtasks();
    };

    /**
     * @description Renders the list of subtasks.
     * If there are no subtasks, it returns early.
     * If an ID for editing is provided, it renders that subtask in edit mode.
     * Otherwise, it renders all subtasks in read-only mode.
     * @function renderSubtasks
     * @memberof taskComponents.subtasks
     * @param {string} idForEdit - The ID of the subtask to edit.
     * @returns {void}
     */
    taskComponentsPrototype.renderSubtasks = function(idForEdit = "", isReset = false) {
        let subTaskList = document.querySelector('.sub-task-list');
        subTaskList.innerHTML = "";
        if (!this.currentSubTasks || this.currentSubTasks.length == 0) { return; }
        for (let i = 0; i < this.currentSubTasks.length; i++) {
            if (this.currentSubTasks[i]['id'] == idForEdit && !isReset) {
                subTaskList.innerHTML += getSubtaskListElementForChanging(this.currentSubTasks[i], this.currentInstance);
                continue;
            }
            subTaskList.innerHTML += getSubtaskListElementReadOnly(this.currentSubTasks[i], this.currentInstance);
        }
    };

})();