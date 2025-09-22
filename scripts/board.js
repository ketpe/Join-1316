let boardTaskComponents = null;


async function getBoardTasks() {
    const { taskContentelements } = getHtmlTasksContent();
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getAllData("tasks"));
    tasks = await getDatabaseTaskCategory(tasks);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    //console.log(tasks);
    renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone);
    addLeftPositionStyleassignedContacts();
    
}


function renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone) {
    tasks.forEach(task => {
        let renderedContacts = '';
        renderedContacts = renderAssignedContacts(task.assignedContacts);
        task.taskStateCategory === 'todo' ? taskToDo.innerHTML += boardTasksTemplate(task, renderedContacts) :
            task.taskStateCategory === 'inprogress' ? taskInProgress.innerHTML += boardTasksTemplate(task, renderedContacts) :
                task.taskStateCategory === 'awaiting' ? taskAwaitingFeedback.innerHTML += boardTasksTemplate(task, renderedContacts) :
                    task.taskStateCategory === 'done' ? taskDone.innerHTML += boardTasksTemplate(task, renderedContacts) : '';
    })
    let taskElements = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone]
    taskElements = addDropZones(taskElements);
    toggleNoTaskVisible(taskElements);
}

function addDropZones(taskElements) {
    taskElements.forEach(tE => { if (tE) tE.innerHTML += boardTaskEmptyDropTemplate() });
    return taskElements
}

function getHtmlTasksContent() {
    let taskContentElements = getBoardTaskref();

    taskContentElements.forEach(tE => { if (tE) tE.innerHTML = ""; });
    taskContentElements.forEach(tE => {
        if (tE) tE.innerHTML = boardTaskEmptyTemplate(tE.dataset.category);

    })
    return { taskContentElements };
}

async function getDatabaseTaskCategory(tasks) {
    for (let task of tasks) {
        const fb = new FirebaseDatabase();
        const categoryData = await fb.getFirebaseLogin(() => fb.getDataByKey("id", task['category'], "categories"));
        task.categoryData = categoryData;
    }
    return tasks;
}

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

function toggleSubtaskCheckbox(element) {
    const btn = element;
    btn.classList.toggle('checkbox-btn-default');
    btn.classList.toggle('checkbox-btn-default-hover');
}

function toggleNoTaskVisible() {
    let taskElements = getBoardTaskref();
    taskElements.forEach(element => {
        let noTask = element.querySelector('.kanban-task-empty');
        if (element.children.length === 2) {
            noTask.classList.remove('visually-hidden');
        } else {
            noTask.classList.add('visually-hidden');
        }
    });
}

function getBoardTaskref() {
    taskToDo = document.getElementById("kanban-tasks-todo");
    taskInProgress = document.getElementById("kanban-tasks-inprogress");
    taskAwaitingFeedback = document.getElementById("kanban-tasks-awaiting");
    taskDone = document.getElementById("kanban-tasks-done");
    taskContentElements = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
    return taskContentElements;
}

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
 * Fetches task details and renders them in the detail view dialog
 * @param {string} taskId 
 */
async function getDetailViewTask(taskId) {
    boardTaskComponents = null;
    let tasks = await getTaskByTaskID(taskId);
    await includeHtml("dialog-content-detail-view-task", "task-template.html");
    const taskUtils = new AddTaskUtils();
    const currentUser = taskUtils.readCurrentUserID();
    const isGuest = taskUtils.isCurrentUserGuest();
    boardTaskComponents = new TaskComponents(currentUser, "boardTaskComponents");
    boardTaskComponents.runWithDataAsView(tasks[0]);
}

/**
 * Toggles the checked state of a subtask in the detail view
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
 * Deletes the current task
 * @param {HTMLElement} button - The button element that was clicked
 */
async function deleteCurrentTask(button) {
    const currentTaskID = button.getAttribute('data-id');
    const taskDelete = new BoardTaskDetailDeleteUtil(currentTaskID);
    if(await taskDelete.startDelete()){
        closeDialog('detail-view-task-dialog');
        getBoardTasks();
    }

}

/**
 * Renders the edit view for the current task in the detail view dialog
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
 * Fetches a task by its ID
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
 * Handles the submission of the edit task form
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
    const [prio, category, subtaskArray, contactAssignedArray] = boardTaskComponents.getData();
    const editTaskUtil = new EditTaskSafeUtil(tasks[0], currentTitle, currentDescription, currentDate, prio, contactAssignedArray, subtaskArray);
    const resultUpdate = await editTaskUtil.startUpdate();
    if (resultUpdate) {
        document.getElementById('dialog-content-detail-view-task').innerHTML = "";
        await getDetailViewTask(currentID);
    }
}

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

function emptySearchBar(searchInput, taskTitles) {
    if (!searchInput) {
        taskTitles.forEach(p => {
            p.parentElement.parentElement.parentElement.classList.remove('visually-hidden');
        });
        return;
    }
}

function getRefsForSearch() {
    let searchInput = document.getElementById('board-searchbar').value.toLowerCase();
    let taskTitles = document.querySelectorAll('.board-task-title p');
    let taskDescriptions = document.querySelectorAll('.board-task-description p');
    return { searchInput, taskTitles, taskDescriptions };
}