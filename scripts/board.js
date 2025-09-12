async function getBoardTasks() {
    const { TaskContentelements } = getHtmlTasksContent();
    let tasks = await getAllData("tasks");
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
        const categoryData = await getDataByKey("id", task['category'], "categories");
        task.categoryData = categoryData;
    }
    return tasks;
}

async function getDatabaseTaskSubtasks(tasks) {
    let getAllTaskSubtasks = await getAllData('taskSubtask');
    let getAllSubtasks = await getAllData('subTasks');
    tasks.forEach(task => {
        let taskSubTasks = getAllTaskSubtasks.filter(obj => obj.maintaskID === task.id);
        let subTasks = [];
        taskSubTasks.forEach(taskSubTask => {
            let foundSubTask = getAllSubtasks.find(obj => obj.id === taskSubTask.subTaskID);
            if (foundSubTask) subTasks.push(foundSubTask);
        });
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
    let getAllAssignedContacts = await getAllData('taskContactAssigned');
    let getAllContacts = await getAllData('contacts');

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
    let assignedContactsTemplate = '';
    assignedContacts.forEach(contactArr => {
        contactArr.forEach(contact => {
            assignedContactsTemplate += getAllAssignedContactsTemplate(contact);
        });
    });
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
        if (element.children.length === 1) {
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
    await updateData(`subTasks/${subTaskID}`, { taskChecked: isActiv == "true" ? false : true });

}

function deleteCurrentTask(button) {
    console.log(button);

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
    let tasks = await getDataByKey("id", taskId, "tasks");
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
    const prio = currentPriority;
    const cList = currentContactAssignList;
    const subList = currentSubTasks;
    const cTask = (await getTaskByTaskID(currentID))[0];

    console.log(currentID);
    console.log(currentTitle);
    console.log(currentDescription);
    console.log(currentDate);
    console.log(prio);
    console.log(cList);
    console.log(subList);
    console.log(cTask);
}