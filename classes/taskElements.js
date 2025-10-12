/**
 * Class representing task elements for a task management interface.
 * Provides methods to generate HTML components for task attributes such as title, description, due date, priority, contacts, categories, and subtasks.
 * Designed to be used in conjunction with a task management application.
 * Example usage:
 * const taskElements = new TaskElements(currentInstance);
 */

class TaskElements{

    /**
     * Creates an instance of the TaskElements class.
     * @param {*} currentInstance - The current instance of the task management application.
     */
    constructor(currentInstance){
        this.currentInstance = currentInstance;
    }

    /**
     * Gets the title component for the task.
     * @param {boolean} isrequired - Indicates if the title is required.
     * @param {string} title - The title text.
     * @returns {string} - The HTML string for the title component.
     */
    getTitleComponent(isrequired = true, title = ""){
        return `
           <aside class="field-frame">
                <label class="task-mobile-label" for="task-title">Title ${isrequired ? '<span aria-hidden="true">*</span>' : ''} </label>
                <input 
                    class="a-t-input" 
                    id="task-title" 
                    name="task-title" 
                    type="text" 
                    placeholder="Enter a title"
                    aria-required="true"
                    aria-describedby="a-t-title-error"
                    oninput="${this.currentInstance}.addTaskTitleOnInput()" 
                    onblur="${this.currentInstance}.taskTitleValidation(this.value)"
                    value="${title}"
                    >
                <div class="a-t-error-text-container">
                    <p id="a-t-title-required" class="error-text-hidden" role="alert">This field is required</p>
                </div>
            </aside>
        `;
    }

    /**
     * Gets the description component for the task.
     * @param {string} description - The description text.
     * @param {boolean} isTaskEdit - Indicates if the task is being edited.
     * @returns {string} - The HTML string for the description component.
     */
    getDescriptionComponents(description = "", isTaskEdit = false){
        return `
            <aside class="field-frame">
                <label class="task-mobile-label" for="task-description">Description</label>
                <textarea class="a-t-text-area ${isTaskEdit ? 'a-t-text-area-task-edit' : ''}" name="task-description" id="task-description"
                    placeholder="Enter a Description">${description}</textarea>
            </aside>
        `;
    }

    /**
     * Gets the due date component for the task.
     * @param {boolean} isrequired - Indicates if the due date is required.
     * @param {string} dueDateValue - The due date value.
     * @returns {string} - The HTML string for the due date component.
     */
    getDueDateComponents(isrequired = true, dueDateValue = ""){
        return `
            <aside class="field-frame field-frame-due-date">
                <label class="task-mobile-label" for="due-date">Due date ${isrequired ? '<span>*</span>' : ''}</label>
                <div class="date-field">
                    <input class="a-t-input date-input" id="due-date-display" type="text" maxlength="10" placeholder="dd/mm/yyyy" name="due-date" aria-required="true" aria-describedby="a-t-due-date-error"
                        inputmode="numeric" onblur="${this.currentInstance}.dateFieldOnChange()"
                        oninput="${this.currentInstance}.dateFieldOnChange()"
                        value="${dueDateValue}"
                        >

                    <input type="date" id="due-date-hidden" placeholder="Date" class="date-input-hidden"
                        onchange="${this.currentInstance}.datePickerSelectionChange(event)">
                    <button type="button" class="date-trigger" aria-label="Kalender öffnen"
                        onclick="${this.currentInstance}.onDateIconClick()">
                        <div role="img" title="Claendar Icon"></div>
                    </button>
                </div>

                <div class="a-t-error-text-container">
                    <p id="a-t-due-date-required" class="error-text-hidden" role="alert">This field is required</p>
                </div>
            </aside>
        `;
    }

    /**
     * Fills the left container with the task elements for adding a new task.
     */
    fillLeftContainerOnAddTask(){
        let leftContainer = document.querySelector(".a-t-f-i-left");
        if(!leftContainer){return;}
        leftContainer.innerHTML += this.getTitleComponent();
        leftContainer.innerHTML += this.getDescriptionComponents();
        leftContainer.innerHTML += this.getDueDateComponents();
    }

    /**
     * Gets the priority button components for the task.
     * @returns {string} - The HTML string for the priority button components.
     */
    getPrioButtonComponents(){
        return `
            <legend class="task-mobile-label" for="task-priority-button">Priority</legend>
            <fieldset id="task-priority-button" class="a-t-priority-button-container">
                <button id="btn-priority-alta" class="btn btn-priority prio-alta" type="button" name="Urgent" data-selected="false" data-name="alta"
                    onclick="${this.currentInstance}.addTaskPrioritySelect(this)">
                    <div>
                        <p>Urgent</p>
                        <div role="img" title="Urgent-Icon" aria-hidden="true"></div>
                    </div>
                </button>
                <button id="btn-priority-media" class="btn btn-priority prio-media" type="button" name="Medium" data-selected="false" data-name="media"
                    onclick="${this.currentInstance}.addTaskPrioritySelect(this)">
                    <div>
                        <p>Medium</p>
                        <div role="img" title="Medium-Icon" aria-hidden="true"></div>
                    </div>
                </button>
                <button id="btn-priority-baja" class="btn btn-priority prio-baja" type="button" name="Low" data-selected="false" data-name="baja"
                    onclick="${this.currentInstance}.addTaskPrioritySelect(this)">
                    <div>
                        <p>Low</p>
                        <div role="img" title="Low-Icon" aria-hidden="true"></div>
                    </div>
                </button>
            </fieldset>
        `;
    }

    /**
     * Gets the contact components for the task.
     * @returns {string} - The HTML string for the contact components.
     */
    getContactComponents(){
        return `
            <aside class="field-frame">
                <label class="task-mobile-label" for="task-assign-to">Assigned to</label>
                <div class="contact-select-container show-front">
                    <input class="a-t-input show-front a-t-contact-input" autocomplete="off" type="text" name="task-assign-to"
                        id="task-assign-to" value="Select contacts to assign" onclick="${this.currentInstance}.showAndHideContacts('show')"
                        oninput="${this.currentInstance}.filterContactFromInputValue(this.value)">

                    <button id="show-and-hide-contacts" class="btn-show-hide-contact-list" type="button"
                        title="show and hide button for contactlist" onclick="${this.currentInstance}.showAndHideContacts('show')">
                        <div id="show-hide-icon-contacts" class="icon-show-list" role="img" title="show or hide icon">
                        </div>
                    </button>
                </div>
            </aside>

            <div id="contact-List-container" class="contact-List-container">
                <div id="contact-List-for-task" class="contact-List-for-task">
                </div>
            </div>
        
        `;
    }

    /**
     * Gets the assigned badges for the task.
     * @returns {string} - The HTML string for the assigned badges.
     */
    getAssignedBadges(){
        return `
            <div id="contact-assigned-badge" class="contact-assigned-badge">
            </div>
        `;
    }

    /**
     * Gets the category components for the task.
     * @returns {string} - The HTML string for the category components.
     */
    getCategoryComponents(){
        return `
            <aside class="field-frame">
                <label for="task-category">Category<span>*</span></label>
                <div class="category-select-container show-front ">
                    <input class="a-t-input a-t-category-input" type="text" name="task-category" id="task-category"
                        value="Select task category" placeholder="Select task category" readonly aria-required="true"
                        onclick="${this.currentInstance}.onclickCategoryInput(this)">

                    <button id="show-and-hide-categories" class="btn-show-hide-category-list" type="button"
                        title="show and hide button for categories" onclick="${this.currentInstance}.showAndHideCategories('show')">
                        <div id="show-hide-icon-category" class="icon-show-list" role="img" title="show or hide icon">
                        </div>
                    </button>
                </div>
            </aside>

            <div class="a-t-error-text-container">
                <p id="a-t-category-required" class="error-text-hidden" role="alert">This field is required</p>
            </div>
        
        `;
    }

    /**
     * Gets the category list container for the task.
     * @returns {string} - The HTML string for the category list container.
     */
    getCategoryListContainer(){
        return `
            <div id="category-list-container" class="category-list-container">
                <div id="category-list-for-task" class="category-list-for-task">
                </div>
            </div>
        `;
    }

    /**
     * Gets the subtask components for the task.
     * @returns {string} - The HTML string for the subtask components.
     */
    getSubTaskComponents(){
        return `
            <aside class="field-frame">
                <label class="task-mobile-label" for="task-sub-task">Subtasks</label>
                <div class="sub-input-container">
                    <input class="a-t-input a-t-sub-input" type="text" name="task-sub-task" id="task-sub-task"
                        onclick="${this.currentInstance}.onclickSubtaskInput(this)" placeholder="Add new subtask" onkeydown="${this.currentInstance}.subtaskInputfieldPressEnter(event, this)">
                    <div id="sub-writing-buttons" class="sub-input-writing-btn-container d-none">
                        <button type="button" title="delete current entry button" aria-label="Delete current entry" onclick="${this.currentInstance}.clearSubInputField()">
                            <div role="img" title="delete icon" aria-hidden="true"></div>
                        </button>
                        <div></div>
                        <button type="button" title="adopt current entry" aria-label="Adopt current entry" onclick="${this.currentInstance}.adoptCurrentSubEntry()">
                            <div role="img" title="check icon" aria-hidden="true"></div>
                        </button>
                    </div>
                </div>
            </aside>
        `;
    }

    /**
     * Gets the subtask list container for the task.
     * @returns {string} - The HTML string for the subtask list container.
     */
    getSubtaskListContainer(){
        return `
            <ul class="sub-task-list" aria-live="polite" aria-relevant="additions removals">
            </ul>
        `;
    }

    /**
     * Fills the right container with the task elements for adding a new task.
     */
    fillRightContainerOnAddTask(){
        let rightContainer = document.querySelector('.a-t-f-i-right');
        rightContainer.innerHTML += this.getPrioButtonComponents();
        rightContainer.innerHTML += this.getContactComponents();
        rightContainer.innerHTML += this.getAssignedBadges();
        rightContainer.innerHTML += this.getCategoryComponents();
        rightContainer.innerHTML += this.getCategoryListContainer();
        rightContainer.innerHTML += this.getSubTaskComponents();
        rightContainer.innerHTML += this.getSubtaskListContainer();
    }

}