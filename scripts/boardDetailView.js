/**
 * @fileoverview
 * @namespace boardDetailView
 * @description Functions for managing the detail view of tasks on the Kanban board, including fetching task details, rendering them in a dialog, handling edits, deletions, and updating the UI accordingly.
 */
/**
 * @function getDetailViewTask
 * @memberof boardDetailView
 * @description Fetches task details and renders them in the detail view dialog
 * @param {string} taskId - The ID of the task to fetch details for
 * @returns {Promise<void>} - A promise that resolves when the task details have been rendered
 */
async function getDetailViewTask(taskId) {
    boardTaskComponents = null;
    let tasks = await getTaskByTaskID(taskId);
    await includeHtml("dialog-content-detail-view-task", "taskTemplate.html");
    const editDialog = document.getElementById('detail-view-task-dialog');
    editDialog.style.background = "white";
    const taskUtils = new AddTaskUtils();
    const currentUser = taskUtils.readCurrentUserID();
    boardTaskComponents = new TaskComponents(currentUser, "boardTaskComponents");
    boardTaskComponents.runWithDataAsView(tasks[0]);
    [headerHeight, mainContentHeight, footerHeight] = new BoardTaskDetailViewUtils().measureCurrentDialogContentHeight();
    setTaskViewEditDialogSize(window.innerHeight);
}

/**
 * @function detailViewChangeSubtaskChecked
 * @memberof boardDetailView
 * @description Toggles the checked state of a subtask in the detail view
 * @param {HTMLElement} button - The button element that was clicked
 * @returns {Promise<void>}
 */
async function detailViewChangeSubtaskChecked(button) {
    button.classList.toggle('checkbox-btn-default');
    button.classList.toggle('checkbox-btn-default-hover');
    const subTaskID = button.getAttribute('data-id');
    const isActiv = button.getAttribute('data-checked');
    const fb = new FirebaseDatabase();
    await fb.getFirebaseLogin(() => fb.updateData(`subTasks/${subTaskID}`, { taskChecked: isActiv == "true" ? false : true }));
}

/**
 * @function deleteCurrentTask
 * @memberof boardDetailView
 * @description Deletes the current task
 * @param {HTMLElement} button - The button element that was clicked
 * @returns {Promise<void>}
 */
async function deleteCurrentTask(button) {
    const currentTaskID = button.getAttribute('data-id');
    const taskDelete = new BoardTaskDetailDeleteUtil(currentTaskID);
    if (await taskDelete.startDelete()) {
        closeDialog('detail-view-task-dialog');
        await showChangesSavedToast(currentTaskID, "Task deleted!");
    }

}

/**
 * @function editCurrentTask
 * @memberof boardDetailView
 * @description Edits the current task. It fetches the task details and opens the edit form in the dialog.
 * @param {HTMLElement} button - The button element that was clicked
 * @returns {Promise<void>}
 */
async function editCurrentTask(button) {
    removeLoadingFunctionFromDialog();
    boardTaskComponents = null;
    const currentTaskID = button.getAttribute('data-id');
    const task = await getTaskByTaskID(currentTaskID);
    const taskUtils = new AddTaskUtils();
    const currentUser = taskUtils.readCurrentUserID();
    boardTaskComponents = new TaskComponents(currentUser, "boardTaskComponents");
    await boardTaskComponents.runWithDataAsEdit(task[0]);
    [headerHeight, mainContentHeight, footerHeight] = new BoardTaskDetailViewUtils().measureCurrentDialogContentHeight();
    headerHeight = 32;
    mainContentHeight = window.innerHeight - 200 - 32 - 82;
    footerHeight = 82;
    setTaskViewEditDialogSize(window.innerHeight);
}

/**
 * @function editCurrentTaskSubmit
 * @memberof boardDetailView
 * @description Submits the edited task details and updates the task in the database.
 * @param {Event} event - The submit event
 * @returns {Promise<void>}
 */
async function editCurrentTaskSubmit(event) {
    if (event) event.preventDefault();
    removeLoadingFunctionFromDialog();
    const currentID = event.submitter.getAttribute('data-id');
    const { title, description, date } = getEditTaskFormValues(event.currentTarget);
    const tasks = await getTaskByTaskID(currentID);
    const [prio, category, subtaskArray, contactAssignedArray] = boardTaskComponents.getTaskDetails;
    const editTaskUtil = new EditTaskSafeUtil(tasks[0], title, description, date, prio, contactAssignedArray, subtaskArray);
    if (await editTaskUtil.startUpdate()) {
        document.getElementById('dialog-content-detail-view-task').innerHTML = "";
        document.getElementById('detail-view-task-dialog').style.background = "rgba(0, 0, 0, .005)";
        await showChangesSavedToast(currentID, "Changes saved!");
    }
}

/**
 * @function getEditTaskFormValues
 * @memberof boardDetailView
 * @description Extracts the values from the edit task form.
 * @param {HTMLFormElement} form - The form element containing the task details.
 * @returns {Object} - An object containing the title, description, and due date of the task.
 */
function getEditTaskFormValues(form) {
    const data = new FormData(form);
    return {
        title: data.get('task-title'),
        description: data.get('task-description'),
        date: data.get('due-date')
    };
}

/**
 * @function showChangesSavedToast
 * @memberof boardDetailView
 * @description Shows a toast message indicating that changes have been saved or delete a Task.
 * If the message indicates that changes were saved, it refreshes the detail view of the task; otherwise, it navigates back to the board.
 * @param {string} currentID - The ID of the current task.
 * @param {string} message - The message to display in the toast.
 * @returns {Promise<void>}
 */
async function showChangesSavedToast(currentID, message) {
    removeLoadingFunctionFromDialog();
    const toast = document.getElementById('addTaskSafeChangesToast');
    const toastText = document.getElementById('addTaskToastText');
    if (!toast || !toastText) { return; }
    toastText.textContent = message;
    toast.classList.add('safe-changes-toast-open');
    await new Promise(resolve => setTimeout(resolve, 1200));
    toast.classList.remove('safe-changes-toast-open');
    await new Promise(resolve => setTimeout(resolve, 600));
    message == "Changes saved!" ? getDetailViewTask(currentID) : navigateToBoard();
}

/**
 * @function removeLoadingFunctionFromDialog
 * @memberof boardDetailView
 * @description Removes the loading function from the detail view dialog
 * @returns {void}
 */
function removeLoadingFunctionFromDialog() {
    const editDialog = document.getElementById('detail-view-task-dialog');
    if (!editDialog) { return; }
}
