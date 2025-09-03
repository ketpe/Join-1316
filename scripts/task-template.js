

function boardTasksTemplate(tasks) {
    return `<div class="kanban-task" draggable="true" id="${tasks.id}" ondragstart="startDrag(event, this)" ondragend="endDrag(this)">
        <div class="board-task-content">
            <div class="board-task-head-category ${tasks.categoryData.categoryColor}">
                <p>${tasks.categoryData.title}</p>
            </div>
            <div class="board-task-title">
                <p>${tasks.title}</p>
            </div>
            <div class="board-task-description">
                <p>${tasks.description}</p>
            </div>
            <div class="board-task-progress">
                <label for="sub-task-progress"></label>
                <progress class="sub-task-progressbar" id="sub-task-progress" value="${tasks.countTrueSubtasks}" max="2"
                    aria-describedby="progress-value">${tasks.countTrueSubtasks}</progress>
                <output class="progress-value-Text" id="progress-value">${tasks.countTrueSubtasks}/Subtasks</output>
            </div>
            <div class="board-task-assigned-priority">
                ${renderAssignedContacts(tasks.assignedContacts)}
                <div class="board-task-priority">
                    <div role="img" aria-label="Priority: " class="priority-icon-${tasks.priority}"></div>
                </div>
            </div>
        </div>
    </div>`
}

function boardTaskEmptyTemplate() {
    return `<div class="kanban-task-empty" >
                                    <p>No Task To Do</p>
                                </div>`
}

function getAllAssignedContactsTemplate(assignedContacts) {
    return `<div class="board-task-assigned" id="${assignedContacts.id}">
                    <div class="assigned-contact-board">
                        <div class="contact-initials-board${assignedContacts.initialColor}">
                            <p class="board-contact-initials-text">${assignedContacts.initials}</p>
                        </div>
                    </div>
                </div>`
}