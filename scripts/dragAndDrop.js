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
        const taskId = draggedTask.getAttribute('id') || draggedTask.dataset.taskId;
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
        updateBtnAfterMovingTask(taskId, newCategory);
    }
    toggleNoTaskVisible();
}

async function moveTaskToCategory(taskId, newCategory) {
    if (!taskId) return console.error('Task ID is null oder undefined.');
    newCategory = rewriteCategory(newCategory);
    const fb = new FirebaseDatabase();
    await fb.getFirebaseLogin(() => fb.updateData(`tasks/${taskId}`, { taskStateCategory: newCategory }));
    moveTaskInDom(taskId, newCategory);
    updateBtnAfterMovingTask(taskId, newCategory);
    getBoardTasks();
}

function rewriteCategory(cat) {
    return cat === 'To-Do' ? 'todo' :
        cat === 'In progress' ? 'inprogress' :
            cat === 'Awaiting feedback' ? 'awaiting' :
                cat === 'Done' ? 'done' : '';
}

function moveTaskInDom(taskId, newCategory) {
    const task = document.getElementById(taskId);
    const col = document.getElementById(newCategory) || document.querySelector(`[data-column="${newCategory}"]`);
    if (task && col) {
        const tasks = col.querySelector('[data-role="kanban-tasks"], .kanban-tasks, .kanban-tasks-mobile');
        const dropzone = col.querySelector('[data-role="kanban-dropzone"], .kanban-dropzone, .kanban-dropzone-mobile');
        if (tasks && dropzone) tasks.insertBefore(task, dropzone);
    }
}

function updateBtnAfterMovingTask(taskId, newCategory) {
    const swapMenu = document.getElementById(`swap-mobile-menu-${taskId}`);
    const { prev: prevCategory, next: nextCategory } = getPrevAndNextCategory(newCategory);
    swapMenu.innerHTML = '';
    swapMenu.innerHTML += getBtnTemplateAfterMovingTask(taskId, prevCategory, nextCategory);
}

function getPrevAndNextCategory(category) {
    return category === 'todo' ? { prev: '', next: ' In progress' } :
        category === 'inprogress' ? { prev: 'To-Do', next: 'Awaiting feedback' } :
            category === 'awaiting' ? { prev: 'In progress', next: 'Done' } :
                category === 'done' ? { prev: 'Awaiting feedback', next: '' } : '';
}