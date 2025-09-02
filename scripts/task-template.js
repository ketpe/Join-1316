

function boardTasksheader(tasks) {
    return `<div class="kanban-task" draggable="true" id="${task.id}" ondragstart="startDrag(event, this)"
    ondragend="endDrag(this)">
    <div class="board-task-content">
        <div class="board-task-head-category">
            <p>${task.categoryData.title}</p>
        </div>
        <div class="board-task-title">
            <p>${task.title}</p>
        </div>
        <div class="board-task-description">
            <p>${task.description}</p>
        </div>`
}

