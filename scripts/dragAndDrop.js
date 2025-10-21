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
        console.log(newCategory);

        const taskId = draggedTask.getAttribute('id') || draggedTask.dataset.taskId;
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
    }
    toggleNoTaskVisible()
}

async function moveTasktoCategory(taskId, newCategory) {
    const taskElement = document.getElementById(taskId);
    console.log(taskElement);
    console.log(newCategory);

    if (newCategory) {
        newCategory === 'To-Do' ? newCategory = 'todo' :
            newCategory === 'In progress' ? newCategory = 'inprogress' :
                newCategory === 'Awaiting feedback' ? newCategory = 'awaiting' :
                    newCategory === 'Done' ? newCategory = 'done' :
                        newCategory;
    }
    console.log(newCategory);
    if (taskId !== null) {
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
    } else {
        console.error('Task ID is null or undefined.');
    }
}