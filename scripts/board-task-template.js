

function boardTasksTemplate(task, rendererdContacts) {
    return `<div class="kanban-task" draggable="true" id="${task.id}" ondragstart="startDrag(event, this)" ondragend="endDrag(this)" onclick="openDialog('detail-view-task-dialog',renderDetailViewTemplate('${task.id}'))">
        <div class="board-task-content">
            <div class="board-task-head-category ${task.categoryData.categoryColor}">
                <p>${task.categoryData.title}</p>
            </div>
            <div class="board-task-title">
                <p>${task.title}</p>
            </div>
            <div class="board-task-description">
                <p>${task.description}</p>
            </div>
            <div class="board-task-progress">
                <label for="sub-task-progress"></label>
                <progress class="sub-task-progressbar" id="sub-task-progress" value="${task.countTrueSubtasks}" max="${task.subTasks.length}"
                    aria-describedby="progress-value">${task.countTrueSubtasks}</progress>
                <output class="progress-value-Text" id="progress-value">${task.countTrueSubtasks}/${task.subTasks.length} Subtasks</output>
            </div>
            <div class="board-task-assigned-priority">
                ${rendererdContacts}
                <div class="board-task-priority">
                    <div role="img" aria-label="Priority:${task.priority} " class="priority-icon-${task.priority}"></div>
                </div>
            </div>
        </div>
    </div>`
}

function boardTaskEmptyTemplate(category) {
    return `<div class="kanban-task-empty visually-hidden" >
                                    <p>No Task ${category}</p>
                                </div>`
}

function getAllAssignedContactsTemplate(assignedContacts) {
    return `<div class="board-task-assigned" id="${assignedContacts.id}">
                    <div class="assigned-contact-board">
                        <div class="contact-initials-board assigned-contact-pos ${assignedContacts.initialColor}">
                            <p class="board-contact-initials-text">${assignedContacts.initial}</p>
                        </div>
                    </div>
                </div>`
}