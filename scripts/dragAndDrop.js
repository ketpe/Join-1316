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
    const currentColumn = task.closest('.kanban-column');
    return currentColumn ? currentColumn.id : '';
}

function hideAllDropzones() {
    document.querySelectorAll('.kanban-dropzone').forEach(dropzone => {
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
        const col = document.getElementById(colId);
        if (col) {
            const dropzone = col.querySelector('.kanban-dropzone');
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
    document.querySelectorAll('.kanban-dropzone').forEach(dropzone => {
        dropzone.style.opacity = '0';
        dropzone.classList.add('d-none');
    });
}

async function dropTask(event, column) {
    column.classList.remove('over');
    if (draggedTask) {
        let dropzone = column.querySelector('.kanban-dropzone');
        column.querySelector('.kanban-tasks').insertBefore(draggedTask, dropzone);
        const newCategory = column.getAttribute('id');
        const taskId = draggedTask.getAttribute('id');
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));

    }
    toggleNoTaskVisible()
}

