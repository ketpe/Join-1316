let boardTaskComponents = null;

/**
 * @description Fetches tasks from the database, processes them, and renders them on the Kanban board. Also updates the board size and styles assigned contacts.
 * @returns {Promise<void>} - A promise that resolves when the tasks have been fetched and rendered.
*/
async function getBoardTasks() {
    boardTaskComponents = null;
    const { taskContentelements } = getHtmlTasksContent();
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getAllData("tasks"));
    tasks = await getDatabaseTaskCategory(tasks);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    kanbanUpdateSize();
    renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone);
    addLeftPositionStyleassignedContacts();
}

/**
 * @description Updates the height of the Kanban board based on the window size and header heights.
 * This function calculates the available height for the Kanban board by subtracting the heights of the header and board header from the total window height, and then sets the height of the Kanban board element accordingly.
 */
function kanbanUpdateSize() {
    const headerHeight = document.getElementById('header').offsetHeight;
    const boardHeaderHeight = document.querySelector('.board-header').offsetHeight;
    const windowsHeight = window.innerHeight;

    const kanbanHeight = windowsHeight - (headerHeight + boardHeaderHeight + 20);
    document.getElementById('board-kanban').style.height = kanbanHeight + "px";
}

/**
 * @description Renders the tasks on the Kanban board. checks the task state category and appends the task to the corresponding column.
 * @param {*} tasks - The list of tasks to render.
 * @param {*} taskToDo - The container for "To Do" tasks.
 * @param {*} taskInProgress - The container for "In Progress" tasks.
 * @param {*} taskAwaitingFeedback - The container for "Awaiting Feedback" tasks.
 * @param {*} taskDone - The container for "Done" tasks.
 */
function renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone) {
    tasks.forEach(task => {
        let renderedContacts = '';
        renderedContacts = renderAssignedContacts(task.assignedContacts);
        task.taskStateCategory === 'todo' ? taskToDo.innerHTML += boardTasksTemplate(task, renderedContacts) :
            task.taskStateCategory === 'inprogress' ? taskInProgress.innerHTML += boardTasksTemplate(task, renderedContacts) :
                task.taskStateCategory === 'awaiting' ? taskAwaitingFeedback.innerHTML += boardTasksTemplate(task, renderedContacts) :
                    task.taskStateCategory === 'done' ? taskDone.innerHTML += boardTasksTemplate(task, renderedContacts) : '';
    })
    let taskItems = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
    taskItems = addDropZones(taskItems);
    toggleNoTaskVisible(taskItems);
}

/**
 * @description Adds empty drop zones to the task columns.
 * @param {*} taskItems - The array of task column elements.
 * @returns {*} - The updated array of task column elements.
 */
function addDropZones(taskItems) {
    taskItems.forEach(tE => { if (tE) tE.innerHTML += boardTaskEmptyDropTemplate() });
    return taskItems
}
/**
 * @description Retrieves the HTML elements for the task content areas.
 * @returns {Array} - An array of HTML elements representing the task content areas.
 */
function getHtmlTasksContent() {
    let taskContentElements = getBoardTaskref();
    taskContentElements.forEach(tE => { if (tE) tE.innerHTML = ""; });
    taskContentElements.forEach(tE => {
        if (tE) tE.innerHTML = boardTaskEmptyTemplate(tE.dataset.category);
    })
    return { taskContentElements };
}
/**
 * @description Retrieves the task categories from the database for the given tasks.
 * @param {*} tasks - The list of tasks to retrieve categories for.
 * @returns {*} - The updated list of tasks with category data.
 */
async function getDatabaseTaskCategory(tasks) {
    for (let task of tasks) {
        const fb = new FirebaseDatabase();
        const categoryData = await fb.getFirebaseLogin(() => fb.getDataByKey("id", task['category'], "categories"));
        task.categoryData = categoryData;
    }
    return tasks;
}

/**
 * @description Retrieves the subtasks from the database for the given tasks.
 * @param {*} tasks - The list of tasks to retrieve subtasks for.
 * @returns {*} - The updated list of tasks with subtask data.
 */
async function getDatabaseTaskSubtasks(tasks) {
    const fb = new FirebaseDatabase();
    let getAllTaskSubtasks = await fb.getFirebaseLogin(() => fb.getAllData('taskSubtask'));
    let getAllSubtasks = await fb.getFirebaseLogin(() => fb.getAllData('subTasks'));
    tasks.forEach(task => {
        let taskSubTasks = getAllTaskSubtasks.filter(obj => obj.maintaskID === task.id);
        let subTasks = [];
        taskSubTasks.forEach(taskSubTask => {
            let foundSubTask = getAllSubtasks.find(obj => obj.id === taskSubTask.subTaskID);
            if (foundSubTask) subTasks.push(foundSubTask);
        });
        //Hier noch sortieren nach position
        task.subTasks = subTasks;
    });
    tasks = getSubTaskSumOfTrue(tasks);
    return tasks;
}
/**
 * @description Calculates the sum of true subtasks for each task.
 * @param {*} tasks - The list of tasks to process.
 * @returns {*} - The updated list of tasks with the count of true subtasks.
 */
function getSubTaskSumOfTrue(tasks) {
    tasks.forEach(task => {
        if (Array.isArray(task.subTasks)) {
            task.countTrueSubtasks = task.subTasks.filter(sT => sT.taskChecked === true).length;
        } else {
            task.countTrueSubtasks = 0;
        }
    });
    return tasks;
}
/**
 * @description Retrieves the assigned contacts from the database for the given tasks.
 * @param {*} tasks - The list of tasks to retrieve assigned contacts for.
 * @returns {*} - The updated list of tasks with assigned contact data.
 */
async function getDatabaseTaskContact(tasks) {
    const fb = new FirebaseDatabase();
    let getAllAssignedContacts = await fb.getFirebaseLogin(() => fb.getAllData('taskContactAssigned'));
    let getAllContacts = await fb.getFirebaseLogin(() => fb.getAllData('contacts'));

    tasks.forEach(task => {
        let assignedContacts = getAllAssignedContacts.filter(obj => obj.taskID === task.id)
        let contacts = [];
        assignedContacts.forEach(assContact => {
            let contact = getAllContacts.filter(obj => obj.id === assContact.contactId)
            if (contact) contacts.push(contact);

        })
        task.assignedContacts = contacts;
    })
    return tasks;
}
/**
 * @description Renders the assigned contacts for a task.
 * @param {*} assignedContacts - The list of assigned contacts to render.
 * @returns {string} - The HTML string representing the assigned contacts.
 */
function renderAssignedContacts(assignedContacts) {
    let breakExecption = {};
    let assignedContactsTemplate = '';
    let counter = 0;
    try {
        assignedContacts.forEach(contactArr => {
            if (counter >= 6) throw breakExecption;
            contactArr.forEach(contact => {
                assignedContactsTemplate += getAllAssignedContactsTemplate(contact);
            });
            counter++;
        });
    } catch (error) {
        return assignedContactsTemplate;
    }
    return assignedContactsTemplate;
}
/**
 * @description Toggles the checked state of a subtask checkbox.
 * @param {*} element - The checkbox element to toggle.
 */
function toggleSubtaskCheckbox(element) {
    const btn = element;
    btn.classList.toggle('checkbox-btn-default');
    btn.classList.toggle('checkbox-btn-default-hover');
}
/**
 * @description Toggles the visibility of the "no tasks" message in each task column based on the number of tasks present.
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
 *
 * @description Retrieves references to the task content areas on the Kanban board.
 * @returns {Array} - An array of HTML elements representing the task content areas.
 */
function getBoardTaskref() {
    taskToDo = document.getElementById("kanban-tasks-todo");
    taskInProgress = document.getElementById("kanban-tasks-inprogress");
    taskAwaitingFeedback = document.getElementById("kanban-tasks-awaiting");
    taskDone = document.getElementById("kanban-tasks-done");
    taskContentElements = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
    return taskContentElements;
}
/**
 * @description Adds left position styles to assigned contact elements within task cards to ensure proper overlapping display.
 */
function addLeftPositionStyleassignedContacts() {
    const taskCards = document.querySelectorAll('.board-task-content');
    taskCards.forEach(card => {
        const contacts = card.querySelectorAll('.assigned-contact-pos');
        contacts.forEach((contact, i) => {
            contact.style.left = `calc(${i * 25}px)`;
        });
    });
}

/**
 * @description Fetches task details and renders them in the detail view dialog
 * @param {string} taskId - The ID of the task to fetch details for
 */
async function getDetailViewTask(taskId) {
    boardTaskComponents = null;
    let tasks = await getTaskByTaskID(taskId);
    await includeHtml("dialog-content-detail-view-task", "taskTemplate.html");
    const taskUtils = new AddTaskUtils();
    const currentUser = taskUtils.readCurrentUserID();
    const isGuest = taskUtils.isCurrentUserGuest();
    boardTaskComponents = new TaskComponents(currentUser, "boardTaskComponents");
    boardTaskComponents.runWithDataAsView(tasks[0]);
}

/**
 * @description Toggles the checked state of a subtask in the detail view
 * @param {HTMLElement} button - The button element that was clicked
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
 * @description Deletes the current task
 * @param {HTMLElement} button - The button element that was clicked
 */
async function deleteCurrentTask(button) {
    const currentTaskID = button.getAttribute('data-id');
    const taskDelete = new BoardTaskDetailDeleteUtil(currentTaskID);
    if (await taskDelete.startDelete()) {
        closeDialog('detail-view-task-dialog');
        getBoardTasks();
    }

}

/**
 * @description Edits the current task. It fetches the task details and opens the edit form in the dialog.
 * @param {HTMLElement} button - The button element that was clicked
 */
async function editCurrentTask(button) {
    boardTaskComponents = null;
    const currentTaskID = button.getAttribute('data-id');
    const task = await getTaskByTaskID(currentTaskID);
    const taskUtils = new AddTaskUtils();
    const currentUser = taskUtils.readCurrentUserID();
    const isGuest = taskUtils.isCurrentUserGuest();
    boardTaskComponents = new TaskComponents(currentUser, "boardTaskComponents");
    await boardTaskComponents.runWithDataAsEdit(task[0]);
}

/**
 * @description Fetches a task by its ID.
 * @param {string} taskId - The ID of the task to fetch
 * @returns {Promise<Array>} - A promise that resolves to an array of task objects
 */
async function getTaskByTaskID(taskId) {
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getDataByKey("id", taskId, "tasks"));
    tasks = await getDatabaseTaskCategory([tasks]);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    return tasks;
}

/**
 * @description Handles the submission of the edit task form
 * @param {Event} event - The submit event
 */
async function editCurrentTaskSubmit(event) {
    if (event) event.preventDefault();
    const currentID = event.submitter.getAttribute('data-id');
    const editTaskFormData = new FormData(event.currentTarget);
    const currentTitle = editTaskFormData.get('task-title');
    const currentDescription = editTaskFormData.get('task-description');
    const currentDate = editTaskFormData.get('due-date');
    const tasks = await getTaskByTaskID(currentID);
    const [prio, category, subtaskArray, contactAssignedArray] = boardTaskComponents.getTaskDetails;
    const editTaskUtil = new EditTaskSafeUtil(tasks[0], currentTitle, currentDescription, currentDate, prio, contactAssignedArray, subtaskArray);
    const resultUpdate = await editTaskUtil.startUpdate();
    if (resultUpdate) {
        document.getElementById('dialog-content-detail-view-task').innerHTML = "";
        await getDetailViewTask(currentID);
    }
}
/**
 * @description Searches for tasks on the board based on the input in the search bar.
 * It filters tasks by title and description, and toggles their visibility accordingly.
 */
function searchTaskInBoard() {
    const { searchInput, taskTitles, taskDescriptions } = getRefsForSearch();
    let visibleCount = 0;
    taskTitles.forEach((titleP, i) => {
        const descP = taskDescriptions[i];
        const match = [titleP, descP].some(
            el => el && el.textContent.toLowerCase().includes(searchInput)
        );
        const card = titleP.parentElement.parentElement.parentElement;
        card.classList.toggle('visually-hidden', !match && searchInput);
        if (!card.classList.contains('visually-hidden')) visibleCount++;
    });
    toggleNoSearchResultHint(visibleCount, searchInput);
}
/**
 * @description Toggles the visibility of the "no search results" hint based on the search results.
 * @param {number} visibleCount - The number of visible task cards.
 * @param {string} searchInput - The current search input.
 */
function toggleNoSearchResultHint(visibleCount, searchInput) {
    const noResultHint = document.getElementById('empty-Search-Result-info');
    if (noResultHint) {
        if (visibleCount === 0 && searchInput) {
            noResultHint.style.display = 'block';
        } else {
            noResultHint.style.display = 'none';
        }
    }
}
/**
 * @description Empties the search bar and shows all task titles.
 * @param {string} searchInput - The current search input.
 * @param {NodeList} taskTitles - The list of task title elements.
 * @returns {void}
 */
function emptySearchBar(searchInput, taskTitles) {
    if (!searchInput) {
        taskTitles.forEach(p => {
            p.parentElement.parentElement.parentElement.classList.remove('visually-hidden');
        });
        return;
    }
}
/**
 * @description Gets references for the search functionality.
 * @returns {Object} - An object containing the search input and task elements.
 */
function getRefsForSearch() {
    let searchInput = document.getElementById('board-searchbar').value.toLowerCase();
    let taskTitles = document.querySelectorAll('.board-task-title p');
    let taskDescriptions = document.querySelectorAll('.board-task-description p');
    return { searchInput, taskTitles, taskDescriptions };
}