let draggedTask = null;

const tasks = document.querySelectorAll('.kanban-task');
const columns = document.querySelectorAll('.kanban-column');
updateEmptyColumns();

tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        draggedTask = task;
        setTimeout(() => {
            task.classList.add('dragging');
        }, 0);
    });
    task.addEventListener('dragend', (e) => {
        task.classList.remove('dragging');
        draggedTask = null;
    });
});

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('over');
    });
    column.addEventListener('dragleave', (e) => {
        column.classList.remove('over');
    });
    column.addEventListener('drop', (e) => {
        column.classList.remove('over');
        if (draggedTask) {
            column.appendChild(draggedTask);
        }
        updateEmptyColumns();
    });
});

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