/**
 * @fileoverview
 * @namespace boardTasks
 * @description Utility functions for rendering tasks on the Kanban board. handling task rendering and styling.
 */

/**
 * @function renderBoardtasks
 * @memberof boardTasks
 * @description Renders the tasks on the Kanban board. checks the task state category and appends the task to the corresponding column.
 * @param {Array} tasks - The list of tasks to render.
 * @param {HTMLElement} taskToDo - The container for "To Do" tasks.
 * @param {HTMLElement} taskInProgress - The container for "In Progress" tasks.
 * @param {HTMLElement} taskAwaitingFeedback - The container for "Awaiting Feedback" tasks.
 * @param {HTMLElement} taskDone - The container for "Done" tasks.
 * @returns {void}
 */
function renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone) {
    tasks.forEach(task => {
        let renderedContacts = '';
        renderedContacts = renderAssignedContacts(task.assignedContacts);
        task.taskStateCategory === 'todo' ? taskToDo.innerHTML += boardTasksTemplate(task, renderedContacts, '', 'In progress') :
            task.taskStateCategory === 'inprogress' ? taskInProgress.innerHTML += boardTasksTemplate(task, renderedContacts, 'To-Do', 'Awaiting feedback') :
                task.taskStateCategory === 'awaiting' ? taskAwaitingFeedback.innerHTML += boardTasksTemplate(task, renderedContacts, 'In progress', 'Done') :
                    task.taskStateCategory === 'done' ? taskDone.innerHTML += boardTasksTemplate(task, renderedContacts, 'Awaiting feedback', '') : '';
    })
    let taskItems = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
    taskItems = addDropZones(taskItems);
    toggleNoTaskVisible(taskItems);
}


/**
 * @function addDropZones
 * @memberof boardTasks
 * @description Adds empty drop zones to the task columns.
 * @param {Array} taskItems - The array of task column elements.
 * @returns {Array} - The updated array of task column elements.
 */
function addDropZones(taskItems) {
    taskItems.forEach(tE => { if (tE) tE.innerHTML += boardTaskEmptyDropTemplate() });
    return taskItems
}

/**
 * @function boardTasksTemplate
 * @memberof boardTasks
 * @description Retrieves the HTML elements for the task content areas.
 * @returns {Array} - An array of HTML elements representing the task content areas.
 */
function getHtmlTasksContent() {
    const [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone] = getBoardTaskref();
    [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone].forEach(tE => { if (tE) tE.innerHTML = ""; });
    [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone].forEach(tE => {
        if (tE) tE.innerHTML = boardTaskEmptyTemplate(tE.dataset.category);
    })
    return [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
}

/**
 * @function getBoardTaskref
 * @memberof boardTasks
 * @description Retrieves references to the task content areas on the Kanban board.
 * @returns {Array} - An array of HTML elements representing the task content areas.
 */
function getBoardTaskref() {
    let taskToDo = document.getElementById("kanban-tasks-todo");
    let taskInProgress = document.getElementById("kanban-tasks-inprogress");
    let taskAwaitingFeedback = document.getElementById("kanban-tasks-awaiting");
    let taskDone = document.getElementById("kanban-tasks-done");
    return [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
}

/**
 * @function toggleNoTaskVisible
 * @memberof boardTasks
 * @description Toggles the visibility of the "no tasks" message in each task column based on the number of tasks present.
 * @returns {void}
 */
function toggleNoTaskVisible() {
    let taskItems = getBoardTaskref();
    taskItems.forEach(element => {
        let noTask = element.querySelector('.kanban-task-empty');
        if (element.children.length === 2) {
            noTask.classList.remove('visually-hidden');
        } else {
            noTask.classList.add('visually-hidden');
        }
    });
}

/**
 * @function addLeftPositionStyleassignedContacts
 * @memberof boardTasks
 * @description Adds left position styles to assigned contact elements within task cards to ensure proper overlapping display.
 * @returns {void}
 */
function addLeftPositionStyleassignedContacts() {
    const taskCards = document.querySelectorAll('.board-task-content');
    taskCards.forEach(card => {
        const contacts = card.querySelectorAll('.assigned-contact-pos');
        contacts.forEach((contact, i) => { contact.style.left = `calc(${i * 25}px)`; });
    });
}