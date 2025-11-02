/**
 * @fileoverview
 * @namespace dragAndDrop
 * @description Implements drag-and-drop functionality for tasks in a Kanban board.
 * Allows users to move tasks between different columns with visual feedback.
 * Updates the task's category in the Firebase database upon dropping.
 */

let draggedTask = null;

/**
 * @function startDrag
 * @memberof dragAndDrop
 * @description Initiates the drag operation for a task.
 * @param {*} event
 * @param {Task} task
 * @return {void}
 */
function startDrag(event, task) {
    draggedTask = task;
    setTimeout(() => {
        task.classList.add('dragging');
        const currentColumnId = getCurrentColumnId(task);
        hideAllDropzones();
        showAllowedDropzones(getAllowedColumns(currentColumnId));
    }, 0);
}

/**
 * @function getCurrentColumnId
 * @memberof dragAndDrop
 * @description Gets the ID of the current column for a task.
 * @param {Task} task
 * @returns {string} The ID of the current column.
 */
function getCurrentColumnId(task) {
    const currentColumn = task.closest('[data-role="kanban-column"], .kanban-column, .kanban-column-mobile');
    return currentColumn ? (currentColumn.id || currentColumn.dataset.column || '') : '';
}

/**
 * @function hideAllDropzones
 * @memberof dragAndDrop
 * @description Hides all drop zones in the Kanban board.
 * @return {void}
 */
function hideAllDropzones() {
    document.querySelectorAll('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile').forEach(dropzone => {
        dropzone.classList.remove('show-dropzone');
        dropzone.style.opacity = '0';
        dropzone.classList.add('d-none');
    });
}

/**
 * @function getAllowedColumns
 * @memberof dragAndDrop
 * @description Gets the allowed columns for a task based on its current column.
 * @param {string} currentColumnId - The ID of the current column.
 * @returns {Array<string>} The array of allowed column IDs.
 */
function getAllowedColumns(currentColumnId) {
    const allowed = {
        todo: ['inprogress'],
        inprogress: ['todo', 'awaiting'],
        awaiting: ['inprogress', 'done'],
        done: ['awaiting', 'inprogress']
    };
    return allowed[currentColumnId] ? allowed[currentColumnId] : [];
}

/**
 * @function showAllowedDropzones
 * @memberof dragAndDrop
 * @description Shows the allowed dropzones for a task being dragged.
 * @param {Array<string>} allowedColumns - The array of allowed column IDs.
 * @return {void}
 */
function showAllowedDropzones(allowedColumns) {
    allowedColumns.forEach(colId => {
        const col = document.getElementById(colId) || document.querySelector(`[data-role="kanban-column"][data-column="${colId}"]`);
        if (col) {
            const dropzone = col.querySelector('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile');
            if (dropzone) {
                dropzone.style.opacity = '1';
                dropzone.classList.remove('d-none');
            };
        }
    });
}

/**
 * @function endDrag
 * @memberof dragAndDrop
 * @description Ends the drag operation for a task.
 * @param {Task} task - The task being dragged.
 * @return {void}
 */
function endDrag(task) {
    task.classList.remove('dragging');
    draggedTask = null;
    document.querySelectorAll('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile').forEach(dropzone => {
        dropzone.style.opacity = '0';
        dropzone.classList.add('d-none');
    });
}

/**
 * @function dropTask
 * @memberof dragAndDrop
 * @description Handles the drop event for a task.
 * @param {DragEvent} event - The drag event.
 * @param {HTMLElement} column - The column element where the task is dropped.
 * @return {Promise<void>}
 */
async function dropTask(event, column) {
    column.classList.remove('over');
    if (draggedTask) {
        let dropzone = column.querySelector('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile');
        const tasksContainer = column.querySelector('[data-role="kanban-tasks"], .kanban-tasks, .kanban-tasks-mobile');
        (tasksContainer || column).insertBefore(draggedTask, dropzone);
        const newCategory = column.id || column.dataset.column;
        const taskId = draggedTask.getAttribute('id') || draggedTask.dataset.taskId;
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
        updateBtnAfterMovingTask(taskId, newCategory);
    }
    toggleNoTaskVisible();
}

/**
 * @function moveTaskToCategory
 * @memberof dragAndDrop
 * @description Moves a task to a new category.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newCategory - The new category to move the task to.
 * @returns {Promise<void>}
 */
async function moveTaskToCategory(taskId, newCategory) {
    if (!taskId) return console.error('Task ID is null oder undefined.');
    if (!newCategory) return;
    newCategory = rewriteCategory(newCategory);
    const fb = new FirebaseDatabase();
    await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
    moveTaskInDom(taskId, newCategory);
    updateBtnAfterMovingTask(taskId, newCategory);
    getBoardTasks();
}

/**
 * @function rewriteCategory
 * @memberof dragAndDrop
 * @description Rewrites the category name to a standardized format.
 * @param {string} cat - The category name to rewrite.
 * @returns {string} The rewritten category name.
 */
function rewriteCategory(cat) {
    return cat === 'To-Do' ? 'todo' :
        cat === 'In progress' ? 'inprogress' :
            cat === 'Awaiting feedback' ? 'awaiting' :
                cat === 'Done' ? 'done' : '';
}

/**
 * @function moveTaskInDom
 * @memberof dragAndDrop
 * @description Moves a task in the DOM to a new category.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newCategory - The new category to move the task to.
 * @return {void}
 */
function moveTaskInDom(taskId, newCategory) {
    const task = document.getElementById(taskId);
    const col = document.getElementById(newCategory) || document.querySelector(`[data-column="${newCategory}"]`);
    if (task && col) {
        const tasks = col.querySelector('[data-role="kanban-tasks"], .kanban-tasks, .kanban-tasks-mobile');
        const dropzone = col.querySelector('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile');
        if (tasks && dropzone) tasks.insertBefore(task, dropzone);
    }
}

/**
 * @function updateBtnAfterMovingTask
 * @memberof dragAndDrop
 * @description Updates the button states after moving a task.
 * @param {string} taskId - The ID of the task that was moved.
 * @param {string} newCategory - The new category of the task.
 * @return {void}
 */
function updateBtnAfterMovingTask(taskId, newCategory) {
    const swapMenu = document.getElementById(`swap-mobile-menu-${taskId}`);
    const { prev: prevCategory, next: nextCategory } = getPrevAndNextCategory(newCategory);
    swapMenu.innerHTML = '';
    swapMenu.innerHTML += getBtnTemplateAfterMovingTask(taskId, prevCategory, nextCategory);
}

/**
 * @function getPrevAndNextCategory
 * @memberof dragAndDrop
 * @description Gets the previous and next category for a given category.
 * @param {string} category - The current category.
 * @returns {{ prev: string, next: string }} The previous and next categories.
 */
function getPrevAndNextCategory(category) {
    return category === 'todo' ? { prev: '', next: ' In progress' } :
        category === 'inprogress' ? { prev: 'To-Do', next: 'Awaiting feedback' } :
            category === 'awaiting' ? { prev: 'In progress', next: 'Done' } :
                category === 'done' ? { prev: 'Awaiting feedback', next: '' } : '';
}