async function renderBoardTasks() {
    const { taskToDo, taskInProgress, taskAwaitingFeedback, taskDone } = getHtmlTaskscontent();
    let tasks = await getAllData("tasks");
    tasks = await getDatabaseTaskCategory(tasks);
    tasks = await getDatabaseTaskSubtasks(tasks);
    // let subtaskscounter = subcounter(tasks);
    console.log(tasks);

}

// function subcounter(tasks) {
//     let sum = 0
//     for (const subTasks of tasks){
//         if (subTasks)
//     }
// }

function getHtmlTaskscontent() {
    const taskToDo = document.getElementById("todo");
    const taskInProgress = document.getElementById("inprogress");
    const taskAwaitingFeedback = document.getElementById("awaiting");
    const taskDone = document.getElementById("done");
    taskToDo.innerHTML = "";
    taskInProgress.innerHTML = "";
    taskAwaitingFeedback.innerHTML = "";
    taskDone.innerHTML = "";
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
    let getallTaskSubtasks = await getAllData('taskSubtask');
    let getallSubtasks = await getAllData('subTasks');

    tasks.forEach(task => {
        let taskSubTasks = getallTaskSubtasks.filter(obj => obj.maintaskID === task.id)
        taskSubTasks.forEach(taskSubTask => {
            let subTasks = getallSubtasks.filter(obj => obj.id === taskSubTask.subTaskID);
            task.subTasks = subTasks;
        })
    });
    return tasks;
}

function toggleSubtaskCheckbox(element) {
    const btn = element;
    btn.classList.toggle('checkbox-btn-default');
    btn.classList.toggle('checkbox-btn-default-hover');
}