class BoardTaskDetailEditUtils{

    constructor(currentTaskID, currentTask, currentInstance){
        this.currentTask = currentTask;
        this.currentTaskID = currentTaskID;
        this.currentInstance = currentInstance;
    }

    async startRenderTaskEdit(){
        this.cleanDialog();
        await this.loadEditHtmlIntoDialog();
        this.renderEditComponents();

    }

    cleanDialog(){
        document.getElementById('dialog-content-detail-view-task').innerHTML = "";
    }

    async loadEditHtmlIntoDialog(){
        await includeHtml("dialog-content-detail-view-task", "task-edit-template.html");
    }

    renderEditComponents(){
        let mainConatiner = document.querySelector('.task-edit-fields');
        let taskComponents = new TaskElements(this.currentInstance);
        mainConatiner.innerHTML += taskComponents.getTitleComonents(false, this.currentTask['title']);
        mainConatiner.innerHTML += taskComponents.getDescriptionComponents(this.currentTask['description'], true);
        mainConatiner.innerHTML += taskComponents.getDueDateComponents(false, this.currentTask['dueDate']);
        mainConatiner.innerHTML += taskComponents.getPrioButtonComponents();
        mainConatiner.innerHTML += taskComponents.getContactComponents();
        mainConatiner.innerHTML += taskComponents.getAssignedBadges();
        mainConatiner.innerHTML += taskComponents.getSubTaskComponents();
        mainConatiner.innerHTML += taskComponents.getSubtaskListContainer();
    }

    getCurrentAssignList(){
        let contacts = [];

        for(let i = 0; i < this.currentTask.assignedContacts.length; i++){
            contacts.push(this.currentTask.assignedContacts[i][0]);
        }

        return contacts;
    }
}