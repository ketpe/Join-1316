class BoardTaskDetailViewUtils {

    currentTask;

    constructor(currentTaskID, tasksArray) { 
        this.tasksArray = tasksArray;
        this.currentTaskID = currentTaskID;
    }

    startRenderTaskDetails(){
        this.getCurrentTask();
        if(this.currentTask == null){return;}

        console.log(this.currentTask);
        
        this.viewCategory();
        this.viewTitle();
        this.viewDescription();
    }

    getCurrentTask(){
        const taskFilter = this.tasksArray.filter(x => x['id'] == this.currentTaskID);
        if(taskFilter.length > 0){
            this.currentTask = taskFilter[0];
        }
    }

    viewCategory(){
        let catElement = document.getElementById('left-header');
        if(!catElement){return;}
        catElement.classList.add(this.currentTask.categoryData.categoryColor);
    }

    viewTitle(){
        let titleElement = document.getElementById('task-title');
        if(!titleElement){return;}
        titleElement.innerHTML = this.currentTask['title'];
    }

    viewDescription(){
        let descElement = document.getElementById('task-description');
        if(!descElement){return;}
        descElement.innerHTML = this.currentTask['description'];
    }

   

}
