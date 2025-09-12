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

    getIndexOfObjectOfArray(objectID, objectArray) {

        let objectFind = objectArray.find(x => x['id'] == objectID);
        if (objectFind == null) { return -1; }
        return objectArray.indexOf(objectFind);
    }

}