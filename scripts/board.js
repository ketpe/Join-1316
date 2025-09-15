
async function getBoardTasks() {
    const { TaskContentelements } = getHtmlTasksContent();
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
    let TaskContentElements = getBoardTaskref();

    TaskContentElements.forEach(tE => { if (tE) tE.innerHTML = ""; });
    TaskContentElements.forEach(tE => {
        if (tE) tE.innerHTML = boardTaskEmptyTemplate(tE.dataset.category);

    })
    return { TaskContentElements };
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
    TaskContentElements = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
    return TaskContentElements;
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

async function renderTaskDetailView(taskId) {
    await includeHtml("dialog-content", "task-template.html");
    getDetailViewTask(taskId); // Hier solltest du die Task-Daten ins Template schreiben!
}

/*NOTE - DetailView*/
async function getDetailViewTask(taskId) {
    let tasks = await getTaskByTaskID(taskId);

    await includeHtml("dialog-content-detail-view-task", "task-template.html");

    const boardUtils = new BoardTaskDetailViewUtils(taskId, tasks);

    openDialog('detail-view-task-dialog');
    boardUtils.startRenderTaskDetails();
    const currentMainHeight = boardUtils.getCurrentHeight();
    boardUtils.setDialogHeight(currentMainHeight);

}

async function detailViewChangeSubtaskChecked(button) {
    button.classList.toggle('checkbox-btn-default');
    button.classList.toggle('checkbox-btn-default-hover');
    const subTaskID = button.getAttribute('data-id');
    const isActiv = button.getAttribute('data-checked');
    const fb = new FirebaseDatabase();
    await fb.getFirebaseLogin(() => fb.updateData(`subTasks/${subTaskID}`, { taskChecked: isActiv == "true" ? false : true }));
}

async function deleteCurrentTask(button) {
    const currentTaskID = button.getAttribute('data-id');
    const taskDelete = new BoardTaskDetailDeleteUtil(currentTaskID);
    if(await taskDelete.startDelete()){
        closeDialog('detail-view-task-dialog');
        getBoardTasks();
    }

}

async function editCurrentTask(button) {
    const currentTaskID = button.getAttribute('data-id');
    const task = await getTaskByTaskID(currentTaskID);
    const boardEditUtil = new BoardTaskDetailEditUtils(currentTaskID, task);
    await boardEditUtil.startRenderTaskEdit();
    await loadContactsAllFromDB();
    await loadCategoriesFromDB();
    setNewPriority(task[0]['priority']);
    currentContactAssignList = boardEditUtil.getCurrentAssignList();
    showOrHideBadgeContainer('show');
    currentSubTasks = task[0]['subTasks'];
    renderSubtasks();
    document.getElementById('detail-edit-ok-btn').setAttribute('data-id', currentTaskID);
}

async function getTaskByTaskID(taskId) {
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getDataByKey("id", taskId, "tasks"));
    tasks = await getDatabaseTaskCategory([tasks]);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    return tasks;
}

async function editCurrentTaskSubmit(event) {
    if (event) event.preventDefault();
    const currentID = event.submitter.getAttribute('data-id');
    const editTaskFormData = new FormData(event.currentTarget);
    const currentTitle = editTaskFormData.get('task-title');
    const currentDescription = editTaskFormData.get('task-description');
    const currentDate = editTaskFormData.get('due-date');
    const tasks = await getTaskByTaskID(currentID);
    const prio = currentPriority;
    const cList = currentContactAssignList;
    const subList = currentSubTasks;
    const editTaskUtil = new EditTaskSafeUtil(tasks[0], currentTitle, currentDescription, currentDate, prio, cList, subList);
    const resultUpdate = await editTaskUtil.startUpdate();
    if (resultUpdate) {
        await afterUpdateTask(currentID);
    }
}

async function afterUpdateTask(taskId) {
    let tasks = await getTaskByTaskID(taskId);

    await includeHtml("dialog-content-detail-view-task", "task-template.html");

    const boardUtils = new BoardTaskDetailViewUtils(taskId, tasks);
    boardUtils.startRenderTaskDetails();
    const currentMainHeight = boardUtils.getCurrentHeight();
    boardUtils.setDialogHeight(currentMainHeight);
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