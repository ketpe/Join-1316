class BoardTaskDetailViewUtils {

    currentTask;

    constructor(currentTaskID, tasksArray) {
        this.tasksArray = tasksArray;
        this.currentTaskID = currentTaskID;
    }

    startRenderTaskDetails() {
        this.getCurrentTask();
        if (this.currentTask == null) { return; }

        console.log(this.currentTask);

        this.viewCategory();
        this.viewTextInDialog('user-story', this.currentTask.categoryData.title);
        this.viewTextInDialog('task-title', this.currentTask['title']);
        this.viewTextInDialog('task-description', this.currentTask['description']);
        this.viewTextInDialog('task-due-date', this.currentTask['dueDate']);
        this.viewTextInDialog('priority-text', this.currentTask['priority']);
        this.viewPriority();
        this.viewAssignedContacts();
        this.viewSubTasks();
    }

    getCurrentTask() {
        const taskFilter = this.tasksArray.filter(x => x['id'] == this.currentTaskID);
        if (taskFilter.length > 0) {
            this.currentTask = taskFilter[0];
        }
    }

    viewCategory() {
        let catElement = document.getElementById('left-header');
        if (!catElement) { return; }
        catElement.classList.add(this.currentTask.categoryData.categoryColor);
    }

    viewTextInDialog(elementID, textValue) {
        let element = document.getElementById(elementID);
        if (!element) { return; }
        element.innerHTML = textValue;
    }

    viewPriority() {
        let prioIconElement = document.querySelector('.priority-indicator div');
        if (!prioIconElement) { return; }
        const cuurentIconClass = this.currentTask['priority'] == "Urgent" ? "priority-icon-Urgent" :
            this.currentTask['priority'] == "Medium" ? "priority-icon-Medium" : "priority-icon-Low";
        prioIconElement.classList.add(cuurentIconClass);
    }

    viewAssignedContacts() {
        let counter = 0;
        let contactSelectElement = document.getElementById('contact-List-for-task');
        for (let i = 0; i < this.currentTask.assignedContacts.length; i++) {

            contactSelectElement.innerHTML += getContactListElement(this.currentTask.assignedContacts[i][0], false, true);
            counter++;
            if (counter >= 3) { break; }
        }
        const heightOfOneContact = 52;
        let heightOfContainer = (this.currentTask.assignedContacts.length <= 3 ?
            heightOfOneContact * this.currentTask.assignedContacts.length : heightOfOneContact * 3);

        contactSelectElement.style.height = (heightOfContainer) + "px";
    }

    viewSubTasks(){
        let subTaskContainer = document.getElementById('detail-view-subtask-container');
        for(let i = 0; i < this.currentTask.subTasks.length; i++){
            subTaskContainer.innerHTML += getSubtaskForDetailView(this.currentTask.subTasks[i]);
        }

        subTaskContainer.style.height = (this.currentTask.subTasks.length * 28) + "px";
    }

}
