let draggedTask = null;

function startDrag(event, task) {
    draggedTask = task;
    setTimeout(() => {
        task.classList.add('dragging');
    }, 0);
}

function endDrag(task) {
    task.classList.remove('dragging');
    draggedTask = null;
    console.log(task);

}

function dropTask(event, column) {
    column.classList.remove('over');
    if (draggedTask) {
        column.querySelector('.kanban-tasks').appendChild(draggedTask);
    }
    toggleNoTaskVisible()
}

