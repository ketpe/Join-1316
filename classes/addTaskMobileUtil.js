class AddTaskMobileUtil{

    constructor(currentInstance){
        this.currentInstance = currentInstance;
    }

    async startRenderAddTaskMobile(){
        this.renderComponents();
    }

    renderComponents(){
        let taskContent = document.querySelector('.add-task-mobile-fields');
        taskContent.innerHTML = "";
        let taskElements = new TaskElements(this.currentInstance);
        taskContent.innerHTML += taskElements.getTitleComonents(true, "");
        taskContent.innerHTML += taskElements.getDescriptionComponents("");
        taskContent.innerHTML += taskElements.getDueDateComponents(true, "");
        taskContent.innerHTML += taskElements.getPrioButtonComponents();
        taskContent.innerHTML += taskElements.getContactComponents();
        taskContent.innerHTML += taskElements.getAssignedBadges();
        taskContent.innerHTML += taskElements.getCategoryComponents();
        taskContent.innerHTML += taskElements.getCategoryListContainer();
        taskContent.innerHTML += taskElements.getSubTaskComponents();
        taskContent.innerHTML += taskElements.getSubtaskListContainer();
        taskContent.innerHTML += `<p class="notice-required"><span aria-hidden="true">*</span>This field is required</p>`;
    }
}