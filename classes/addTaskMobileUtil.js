
/**
 * Class for rendering the add task components on mobile devices.
 */

class AddTaskMobileUtil{

    constructor(currentInstance){
        this.currentInstance = currentInstance;
    }

    /**
     * Starts the rendering process for adding a task on mobile devices.
     * @returns {Promise<void>}
     */
    async startRenderAddTaskMobile(){
        this.renderComponents();
    }

    /**
     * Renders the components needed for adding a task on mobile devices.
     * @returns {void}
     */
    renderComponents(){
        let taskContent = document.querySelector('.add-task-mobile-fields');
        taskContent.innerHTML = "";
        let taskElements = new TaskElements(this.currentInstance);
        taskContent.innerHTML += taskElements.getTitleComponent(true, "");
        taskContent.innerHTML += taskElements.getDescriptionComponents("");
        taskContent.innerHTML += taskElements.getDueDateComponents(true, "");
        taskContent.innerHTML += taskElements.getPrioButtonComponents();
        taskContent.innerHTML += taskElements.getContactComponents();
        taskContent.innerHTML += taskElements.getAssignedBadges();
        taskContent.innerHTML += taskElements.getCategoryComponents();
        taskContent.innerHTML += taskElements.getCategoryListContainer();
        taskContent.innerHTML += taskElements.getSubTaskComponents();
        taskContent.innerHTML += taskElements.getSubtaskListContainer();
        taskContent.innerHTML += `<p class="notice-required"><span class="required-label" aria-hidden="true">*</span>This field is required</p>`;
    }
}