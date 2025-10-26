
function boardTasksTemplate(task, rendererdContacts, prevCategory, nextCategory) {
    return `<div class="kanban-task" draggable="true" id="${task.id}" ondragstart="startDrag(event, this)" ondragend="endDrag(this)"
    onclick="getDetailViewTask('${task.id}')"  data-task-id="${task.id}">
    <div class="board-task-content">
        <div class="board-category-and-swap">
            <div class="board-task-head-category ${task.categoryData.categoryColor}">
                <p>${task.categoryData.title}</p>
            </div>
             <button type="button" class="swap-mobile-menu" id="swap-mobile-btn-${task.id}" onclick="openSwapMobileMenu(event,'${task.id}')">
                <div role="img" aria-label="swap Button icon" class="swap-mobile-icon"></div>
            </button>

        </div>
        <section id="swap-mobile-menu-${task.id}" class="swap-menu " onclick="closeSwapMobileMenu(event,'${task.id}')">
                <div class="swap-menu-options">
                <h3 class="swap-menu-title">Move to</h3>
                <div id="subMenu" class="swap-menu-mobile-box" data-dOrM="mobile">
                    <button type="button" class="btn-swapmenu" onclick="moveTaskToCategory('${task.id}','${prevCategory}')">
                    <div role="img" aria-label="to do icon" class="swap-menu-icon swap-menu-icon-up"></div>
                    <p>${prevCategory}</p>
                    </button>
                    <button type="button" class="btn-swapmenu" onclick="moveTaskToCategory('${task.id}','${nextCategory}')">
                    <div role="img" aria-label="review icon" class="swap-menu-icon swap-menu-icon-down"></div>
                    <p>${nextCategory}</p>
                    </button>
                    </div>
                </div>
            </section>
        <div class="board-task-title">
            <p>${task.title}</p>
        </div>
        <div class="board-task-description">
            <p>${task.description}</p>
        </div>
        <div class="board-task-progress">
            <label for="sub-task-progress" class="visually-hidden" aria-hidden="true">Label for progress</label>
            <progress class="sub-task-progressbar" id="sub-task-progress" value="${task.countTrueSubtasks}"
                max="${task.subTasks.length}" aria-describedby="progress-value">${task.countTrueSubtasks}</progress>
            <output class="progress-value-Text" id="progress-value">${task.countTrueSubtasks}/${task.subTasks.length}
                Subtasks</output>
        </div>
        <div class="board-task-assigned-priority">
            ${rendererdContacts}
            <div class="board-task-priority">
                <div role="img" aria-label="Priority:${task.priority} " class="priority-icon-${task.priority}"></div>
            </div>
        </div>
    </div>
    <div class="swap-overlay" id="swap-overlay-${task.id}" onclick="closeSwapMobileMenu(event,'${task.id}')"></div>
</div>`
}

function boardTaskEmptyTemplate(category) {
    return `<div class="kanban-task-empty visually-hidden">
    <p>No Task ${category}</p>
</div>`
}

function boardTaskEmptyDropTemplate() {
    return `<div id="kanban-dropzone" class="kanban-dropzone" >
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
function getBtnTemplateAfterMovingTask(taskId, prevCategory, nextCategory) {
    return `<button type="button" class="btn-swapmenu" onclick="moveTaskToCategory('${taskId}','${prevCategory}')">
                    <div role="img" aria-label="to do icon" class="swap-menu-icon swap-menu-icon-up"></div>
                    <p>${prevCategory}</p>
                    </button>
                    <button type="button" class="btn-swapmenu" onclick="moveTaskToCategory('${taskId}','${nextCategory}')">
                    <div role="img" aria-label="review icon" class="swap-menu-icon swap-menu-icon-down"></div>
                    <p>${nextCategory}</p>
                    </button>
                    </div>`
}
