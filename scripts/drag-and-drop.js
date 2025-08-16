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
}

function dropTask(event, column) {
    column.classList.remove('over');
    if (draggedTask) {
        column.querySelector('.kanban-tasks').appendChild(draggedTask);
    }
    updateEmptyColumns();
}

function updateEmptyColumns() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        const tasks = column.querySelectorAll('.kanban-task');
        const emptyState = column.querySelector('.kanban-task-empty');
        if (tasks.length === 0 && emptyState) {
            emptyState.hidden = false;
        } else if (emptyState) {
            emptyState.hidden = true;
        }
    });
}