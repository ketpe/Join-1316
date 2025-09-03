async function renderBoardTasks() {
    const { taskToDo, taskInProgress, taskAwaitingFeedback, taskDone } = getHtmlTaskscontent();
    const boardref = document.getElementById('board-kanban');
    boardref.innerHTML = '';
    let tasks = await getAllData("tasks");
    tasks = await getDatabaseTaskCategory(tasks);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    tasks.forEach(task => {
        boardref.innerHTML += boardTasksTemplate(task);
    })
    console.log(tasks);


}

function getHtmlTaskscontent() {
    const taskToDo = document.getElementById("todo");
    const taskInProgress = document.getElementById("inprogress");
    const taskAwaitingFeedback = document.getElementById("awaiting");
    const taskDone = document.getElementById("done");
    const taskElements = [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone];
    taskElements.forEach(tE => { if (tE) tE.innerHTML = ""; });
    taskElements.forEach(tE => {
        if (tE) tE.innerHTML = boardTaskEmptyTemplate();
    })
    return { taskToDo, taskInProgress, taskAwaitingFeedback, taskDone };
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
    console.log(getAllAssignedContacts);

    tasks.forEach(task => {
        let assignedContacts = getAllAssignedContacts.filter(obj => obj.taskID === task.id)
        assignedContacts.forEach(assContact => {
            let contact = getAllContacts.filter(obj => obj.id === assContact.contatactId)
            task.assignedContacts = contact;

        })
        console.log(assignedContacts);

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