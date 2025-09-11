let draggedTask = null;

function startDrag(event, task) {
    draggedTask = task;
    setTimeout(() => {
        task.classList.add('dragging');
        console.log(task);

    }, 0);
}

function endDrag(task) {
    task.classList.remove('dragging');
    draggedTask = null;
}

async function dropTask(event, column) {
    column.classList.remove('over');
    if (draggedTask) {
        column.querySelector('.kanban-tasks').appendChild(draggedTask);
        const newCategory = column.getAttribute('id');
        const taskId = draggedTask.getAttribute('id');
        await updateData(`tasks/${taskId}`, { taskStateCategory: newCategory });
    }
    toggleNoTaskVisible()
}

