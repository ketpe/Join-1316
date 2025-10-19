let draggedTask = null;

function startDrag(event, task) {
    draggedTask = task;
    setTimeout(() => {
        task.classList.add('dragging');
        const currentColumnId = getCurrentColumnId(task);
        hideAllDropzones();
        showAllowedDropzones(getAllowedColumns(currentColumnId));
    }, 0);
}

function getCurrentColumnId(task) {
    // suche zuerst nach data-role, dann nach bekannten Klassen
    const currentColumn = task.closest('[data-role="kanban-column"], .kanban-column, .kanban-column-mobile');
    return currentColumn ? (currentColumn.id || currentColumn.dataset.column || '') : '';
}

function hideAllDropzones() {
    document.querySelectorAll('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile').forEach(dropzone => {
        dropzone.classList.remove('show-dropzone');
        dropzone.style.opacity = '0';
        dropzone.classList.add('d-none');
    });
}

function getAllowedColumns(currentColumnId) {
    const allowed = {
        todo: ['inprogress'],
        inprogress: ['todo', 'awaiting'],
        awaiting: ['inprogress', 'done'],
        done: ['awaiting', 'inprogress']
    };
    return allowed[currentColumnId] ? allowed[currentColumnId] : [];
}

function showAllowedDropzones(allowedColumns) {
    allowedColumns.forEach(colId => {
        // versuche zuerst per id, fallback auf data-column
        const col = document.getElementById(colId) || document.querySelector(`[data-role="kanban-column"][data-column="${colId}"]`);
        if (col) {
            const dropzone = col.querySelector('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile');
            if (dropzone) {
                dropzone.style.opacity = '1';
                dropzone.classList.remove('d-none');
            };
        }
    });
}

function endDrag(task) {
    task.classList.remove('dragging');
    draggedTask = null;
    // korrekt alle Dropzones auswählen
    document.querySelectorAll('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile').forEach(dropzone => {
        dropzone.style.opacity = '0';
        dropzone.classList.add('d-none');
    });
}

async function dropTask(event, column) {
    column.classList.remove('over');
    if (draggedTask) {
        let dropzone = column.querySelector('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile');
        const tasksContainer = column.querySelector('[data-role="kanban-tasks"], .kanban-tasks, .kanban-tasks-mobile');
        (tasksContainer || column).insertBefore(draggedTask, dropzone);
        const newCategory = column.id || column.dataset.column;
        const taskId = draggedTask.getAttribute('id') || draggedTask.dataset.taskId;
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
    }
    toggleNoTaskVisible()
}

