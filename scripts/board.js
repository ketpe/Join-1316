async function renderBoardTasks() {
    const { taskToDo, taskInProgress, taskAwaitingFeedback, taskDone } = getTaskscontent();

}

function getTaskscontent() {
    const taskToDo = document.getElementById("todo");
    const taskInProgress = document.getElementById("inprogress");
    const taskAwaitingFeedback = document.getElementById("awaiting-feedback");
    const taskDone = document.getElementById("done");
    taskToDo.innerHTML = "";
    taskInProgress.innerHTML = "";
    taskAwaitingFeedback.innerHTML = "";
    taskDone.innerHTML = "";
    return { taskToDo, taskInProgress, taskAwaitingFeedback, taskDone };
}