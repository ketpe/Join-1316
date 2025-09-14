class EditTaskSafeUtil{

    editTask;

    constructor(task, currentTitle, currentDescription, currentDueDate, currentPrio, currentContactList, currentSubtasks){
        this.task = task;
        this.currentTitle = currentTitle;
        this.currentDescription = currentDescription;
        this.currentDueDate = currentDueDate;
        this.currentPrio = currentPrio;
        this.currentContactList = currentContactList;
        this.currentSubtasks = currentSubtasks;
    }

    startUpdate(){
        this.createUpdateTask();
    }

    createUpdateTask(){ 
        this.editTask = new Task(
            this.task['id'], 
            this.currentTitle, 
            this.currentDescription, 
            this.currentDueDate, 
            this.currentPrio, 
            this.task['categoryData']['id'], 
            this.task['taskStateCategory']
        );

    }

    getCleanContactAssignList(){
        let contacts = [];

        for(let i = 0; i < this.task.assignedContacts.length; i++){
            contacts.push(this.task.assignedContacts[i][0]);
        }

        return contacts;
    }

    findNoLongerAssociatedContacts(){

        let contactForRemove = [];

        for(let i = 0; i < this.task.assignedContacts.length; i++){
            const assignedContact = this.task.assignedContacts[i][0];
            const indexOfContactInCurrentList = this.getIndexOfObjectOfArray(assignedContact['id'], this.currentContactList);
            if(indexOfContactInCurrentList == -1){
                contactForRemove.push(assignedContact);
            }
        }

        return contactForRemove;
    }

    findNewAssociatedContacts(){
        let newContacts = [];
        const cleanContactList = this.getCleanContactAssignList();
        for(let i = 0; i < this.currentContactList.length; i++){
            const indexOfContactInOldList = this.getIndexOfObjectOfArray(this.currentContactList[i]['id'], cleanContactList);
            if(indexOfContactInOldList == -1){
                newContacts.push(this.currentContactList[i]);
            }
        }
        return newContacts();
    }

    findNoLongerAssociatedSubtasks(){
        let subtasksForRemove = [];
        for(let i = 0; i < this.task.subTasks.length; i++){
            const assignedSubtask = this.task.subTasks[i];
            const indexOfSubtaskInCurrentList = this.getIndexOfObjectOfArray(assignedSubtask['id'], this.currentSubtasks);
            if(indexOfSubtaskInCurrentList == -1){
                subtasksForRemove.push(assignedSubtask);
            }
        }

        return subtasksForRemove;

    }

    findNewAssociatedSubtasks(){
        let newSubtasks = [];
        for(let i = 0; i < this.currentSubtasks.length; i++){
            const currentSubtask = this.currentSubtasks[i];
            const indexOfSubtaskOldList = this.getIndexOfObjectOfArray(currentSubtask['id'], this.task.subTasks);
            if(indexOfSubtaskOldList == -1){
                newSubtasks.push(currentSubtask);
            }
        }
        return newSubtasks;
    }

    getIndexOfObjectOfArray(objectID, objectArray) {

        let objectFind = objectArray.find(x => x['id'] == objectID);
        if (objectFind == null) { return -1; }
        return objectArray.indexOf(objectFind);
    }

    async removeContactTaskConnection(contactListForRemove){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < contactListForRemove.length; i++){
            //const result = await fb.getFirebaseLogin(() => fb.getAllData('contacts'));
        }
    }

    async getTaskContactAssignedList(){
        const fb = new FirebaseDatabase();
        const dataArray = await fb.getFirebaseLogin(() => fb.getAllData('taskContactAssigned'));
        const taskContactList = dataArray.filter(x => x['taskID'] == this.task['id']);
        return taskContactList;
    }

    async getTaskSubtaskList(){
        const fb = new FirebaseDatabase();
        const dataArray = await fb.getFirebaseLogin(() => fb.getAllData('taskSubtask'));
        const taskToSubtaskList = dataArray.filter(x => x['maintaskID'] == this.task['id']);
        return dataArray;
    }

}