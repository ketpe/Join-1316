async function getBoardTasks() {
    const { TaskContentelements } = getHtmlTasksContent();
    let tasks = await getAllData("tasks");
    tasks = await getDatabaseTaskCategory(tasks);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    console.log(tasks);
    console.log(taskToDo, taskInProgress, taskAwaitingFeedback, taskDone);
    renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone);
}

function renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone) {
    let renderedContacts = '';
    tasks.forEach(task => {
        renderedContacts = renderAssignedContacts(task.assignedContacts);
        task.taskStateCategory === 'todo' ? taskToDo.innerHTML += boardTasksTemplate(task, renderedContacts) :
            task.taskStateCategory === 'inprogress' ? taskInProgress.innerHTML += boardTasksTemplate(task, renderedContacts) :
                task.taskStateCategory === 'awaiting' ? taskAwaitingFeedback.innerHTML += boardTasksTemplate(task, renderedContacts) :
                    task.taskStateCategory === 'done' ? taskDone.innerHTML += boardTasksTemplate(task, renderedContacts) : '';
    })
    let taskElements = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone]
    console.log(taskElements);

    toggleNoTaskVisible(taskElements);
}

function getHtmlTasksContent() {
    let TaskContentElements = getBoardTaskref();

    TaskContentElements.forEach(tE => { if (tE) tE.innerHTML = ""; });
    TaskContentElements.forEach(tE => {
        if (tE) tE.innerHTML = boardTaskEmptyTemplate();
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
        let taskSubTasks = getAllTaskSubtasks.filter(obj => obj.maintaskID === task.id)
        taskSubTasks.forEach(taskSubTask => {
            let subTasks = getAllSubtasks.filter(obj => obj.id === taskSubTask.subTaskID);
            task.subTasks = subTasks;
        })
    });
    tasks = getSubTaskSumOfTrue(tasks);
    return tasks;
}

function getSubTaskSumOfTrue(tasks) {
    tasks.forEach(task => {
        if (Array.isArray(task.subTasks)) {
            task.countTrueSubtasks = task.subTasks.filter(sT => sT === true).length;
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
        assignedContacts.forEach(assContact => {
            let contact = getAllContacts.filter(obj => obj.id === assContact.contatactId)
            task.assignedContacts = contact;
        })
    })
    return tasks;
}

function renderAssignedContacts(assignedContacts) {
    let assignedContactsTemplate = '';
    assignedContacts.forEach(contacts => {
        let contact = getAllAssignedContactsTemplate(contacts);
        assignedContactsTemplate += contact;
    })
    return assignedContactsTemplate
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