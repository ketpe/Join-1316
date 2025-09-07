class CreateNewTask {
    constructor(task, subtasks, contactAssignArray) {
        this.task = task;
        this.subtasks = subtasks;
        this.contactAssignArray = contactAssignArray;
    }

    async start() {
        await this.addTaskCreateSubtaskArray(this.task);
    }

    //Wenn Subtasks vorhanden sind diese hier als Array erstellen
    async addTaskCreateSubtaskArray(currentTask) {
        let subTaskArray = [];
        for (let i = 0; i < this.subtasks.length; i++) {
            subTaskArray.push(new Subtask(getNewUid(), this.subtasks[i]['title'], false));
        }

        await this.addTaskContactAssinged(currentTask, subTaskArray);
    }

    //Kontake, auch den eigenen, mit dem Task verbinden
    //TODO - Den aktuellen Kontakt aus der Session auslesen
    async addTaskContactAssinged(currentTask, subTaskArray) {

        let newContactAssignedArray = [];

        newContactAssignedArray.push(new ContactAssinged(getNewUid(), currentTask.id, contacktIDTest));

        for (let i = 0; i < this.contactAssignArray.length; i++) {
            newContactAssignedArray.push(new ContactAssinged(getNewUid(), currentTask.id, this.contactAssignArray[i]['id']));
        }

        await this.subtaskToTaskConnection(currentTask, subTaskArray, newContactAssignedArray);
    }

    //Die Substasks mit dem Task verbinden
    async subtaskToTaskConnection(currentTask, subTaskArray, assignedContactArray) {
        let subtaskToTaskArray = [];

        for (let i = 0; i < subTaskArray.length; i++) {
            subtaskToTaskArray.push(new SubstaskToTask(getNewUid(), currentTask.id, subTaskArray[i]['id']));
        }

        await this.addTaskCreateDBEntries(currentTask, subTaskArray, assignedContactArray, subtaskToTaskArray)
    }

    //Alle gesammelten Daten in die DB Schreiben
    async addTaskCreateDBEntries(currentTask, subTaskArray, assignedContactArray, subtaskToTaskArray) {
        await putData(`/tasks/${currentTask.id}`, currentTask);

        for (let subIndex = 0; subIndex < subTaskArray.length; subIndex++) {
            await putData(`/subTasks/${subTaskArray[subIndex].id}`, subTaskArray[subIndex]);
        }

        for (let contactIndex = 0; contactIndex < assignedContactArray.length; contactIndex++) {
            await putData(`/taskContactAssigned/${assignedContactArray[contactIndex].id}`, assignedContactArray[contactIndex]);
        }

        for (let subToTaskIndex = 0; subToTaskIndex < subtaskToTaskArray.length; subToTaskIndex++) {
            await putData(`/taskSubtask/${subtaskToTaskArray[subToTaskIndex].id}`, subtaskToTaskArray[subToTaskIndex]);
        }

    }

}