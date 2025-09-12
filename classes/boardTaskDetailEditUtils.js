class BoardTaskDetailEditUtils{
    constructor(currentTaskID, currentTask){
        this.currentTask = currentTask;
        this.currentTaskID = currentTaskID;
    }

    startRenderTaskEdit(){
        this.cleanDialog();
    }

    cleanDialog(){
        document.getElementById('dialog-content-detail-view-task').innerHTML = "";
    }

}