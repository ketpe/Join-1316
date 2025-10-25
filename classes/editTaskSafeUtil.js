/**
 * Class to handle the safe editing of a task
 * Ensures that contacts and subtasks are properly managed during the update process
 * Handles the addition and removal of contacts and subtasks associated with the task
 * Updates the task details while maintaining data integrity
 * @class EditTaskSafeUtil
 * @constructor
 * @param {Array} task - The current task data from the database
 * @param {string} currentTitle - The updated title for the task
 * @param {string} currentDescription - The updated description for the task
 * @param {string} currentDueDate - The updated due date for the task
 * @param {string} currentPrio - The updated priority for the task
 * @param {Array} currentContactList - The list of contacts currently assigned to the task
 * @param {Array} currentSubtasks - The list of subtasks currently associated with the task
 * @returns {boolean} true if the update was successful, otherwise false
 */

class EditTaskSafeUtil{


    constructor(task, currentTitle, currentDescription, currentDueDate, currentPrio, currentContactList, currentSubtasks){
        this.task = task;
        this.currentTitle = currentTitle;
        this.currentDescription = currentDescription;
        this.currentDueDate = currentDueDate;
        this.currentPrio = currentPrio;
        this.currentContactList = currentContactList;
        this.currentSubtasks = currentSubtasks;
    }

    /**
     * Start the update process for the task
     * Read the currently stored contacts for the task from the database
     * Read the currently stored subtasks for the task from the database
     * Determine the contacts that are no longer needed
     * Determine the new / additional contacts
     * Determine the subtasks that are no longer needed -> also delete the subtasks at the end
     * Determine the new / additional subtasks -> also create these
     * Update the task
     * Remove the old contacts
     * Integrate the new contacts
     * Remove the old subtasks
     * Integrate the new subtasks
     * Update the current subtasks
     * @returns {boolean} true if everything was successful, otherwise false
     */
    async startUpdate(){
        /* const editTask = this.createUpdateTask();
        const [contactsDbList, taskContactDBList] = await this.getTaskContactAssignedList();
        const [subtaskDbList, taskToSubtaskDBList, maxPos] = await this.getTaskSubtaskList();
        const removeContactsFromTask = this.findNoLongerAssociatedContacts(contactsDbList);
        const newContactsToTask = this.findNewAssociatedContacts(contactsDbList);
        const removeSubtasksFromTask = this.findNoLongerAssociatedSubtasks(subtaskDbList);
        const newSubtasksToTask = this.findNewAssociatedSubtasks(subtaskDbList);

        if(!await this.updateTask(editTask)){return false;}
        if(!await this.removeContactsTaskAssociation(removeContactsFromTask, taskContactDBList)){return false;}
        if(!await this.addContactsTaskAssociation(newContactsToTask)){return false;}
        if(!await this.removeSubtasksFromTask(removeSubtasksFromTask, taskToSubtaskDBList)){return false;}
        if(!await this.addNewSubtasksToTask(newSubtasksToTask, maxPos)){return false;}
        if(!await this.updateCurrentSubtasks()){return false;} */
        return true;
    }

    /**
     * Create a new Task object with the updated details
     * @returns {Task} - Returns a Task object with the updated details
     */
    createUpdateTask(){ 
        return new Task(
            this.task['id'], 
            this.currentTitle, 
            this.currentDescription, 
            this.currentDueDate, 
            this.currentPrio, 
            this.task['categoryData']['id'], 
            this.task['taskStateCategory']
        );
    }

    /**
     * Get a list of contacts that are no longer associated with the task
     * @returns {Array} - Returns a list of contacts that are no longer associated with the task
     */
    findNoLongerAssociatedContacts(contactsListDb){

        let contactForRemove = [];

        for(let i = 0; i < contactsListDb.length; i++){
            const assignedContact = contactsListDb[i];
            const indexOfContactInCurrentList = this.getIndexOfObjectOfArray(assignedContact['id'], this.currentContactList);
            if(indexOfContactInCurrentList == -1){
                contactForRemove.push(assignedContact);
            }
        }

        return contactForRemove;
    }

    /**
     * Get a list of contacts that are newly associated with the task
     * @returns {Array} - Returns a list of contacts that are newly associated with the task
     */
    findNewAssociatedContacts(contactListDb){
        let newContacts = [];
        for(let i = 0; i < this.currentContactList.length; i++){
            const indexOfContactInOldList = this.getIndexOfObjectOfArray(this.currentContactList[i]['id'], contactListDb);
            if(indexOfContactInOldList == -1){
                newContacts.push(this.currentContactList[i]);
            }
        }
        return newContacts;
    }

    /**
     * Get a list of subtasks that are no longer associated with the task
     * @returns {Array} - Returns a list of subtasks that are no longer associated with the task
     */
    findNoLongerAssociatedSubtasks(subtasksListDb){
        let subtasksForRemove = [];
        for(let i = 0; i < subtasksListDb.length; i++){
            const assignedSubtask = subtasksListDb[i];
            const indexOfSubtaskInCurrentList = this.getIndexOfObjectOfArray(assignedSubtask['id'], this.currentSubtasks);
            if(indexOfSubtaskInCurrentList == -1){
                subtasksForRemove.push(assignedSubtask);
            }
        }

        return subtasksForRemove;

    }

    /**
     * Get a list of subtasks that are newly associated with the task
     * @returns {Array} - Returns a list of subtasks that are newly associated with the task
     */
    findNewAssociatedSubtasks(subtaskDbList){
        let newSubtasks = [];
        for(let i = 0; i < this.currentSubtasks.length; i++){
            const currentSubtask = this.currentSubtasks[i];
            const indexOfSubtaskOldList = this.getIndexOfObjectOfArray(currentSubtask['id'], subtaskDbList);
            if(indexOfSubtaskOldList == -1){
                newSubtasks.push(currentSubtask);
            }
        }
        return newSubtasks;
    }

    /**
     * Get the index of an object in an array by its ID
     * @param {string} objectID - The ID of the object to find
     * @param {Array} objectArray - The array to search
     * @returns {number} - The index of the object in the array, or -1 if not found
     */
    getIndexOfObjectOfArray(objectID, objectArray) {

        let objectFind = objectArray.find(x => x['id'] == objectID);
        if (objectFind == null) { return -1; }
        return objectArray.indexOf(objectFind);
    }


    /**
     * Get a list of taskContactAssigned objects associated with the current task
     * @returns {Array} - Returns a list of taskContactAssigned objects associated with the current task
     */
    async getTaskContactAssignedList(){
        const fb = new FirebaseDatabase();
        const dataArray = await fb.getFirebaseLogin(() => fb.getAllData('taskContactAssigned'));
        const taskContactList = dataArray.filter(x => x['taskID'] == this.task['id']);
        const contacts = await this.getContactsListDb(taskContactList);
        return [contacts, taskContactList];
    }

    /**
     * Get a list of contacts associated with the task
     * @param {Array} taskContactList 
     * @returns {Array} - Returns a list of contact objects associated with the task
     */
    async getContactsListDb(taskContactList){
        let currentContacts = [];
        const fb = new FirebaseDatabase();
        const dataArray = await fb.getFirebaseLogin(() => fb.getAllData('contacts'));
        for(let i = 0; i < taskContactList.length; i++){
            const contact = dataArray.find(x => x['id'] == taskContactList[i]['contactId']);
            if(contact){currentContacts.push(contact);}
        }
        return currentContacts;
    }

    /**
     * Get a list of taskSubtask objects associated with the current task
     * @returns {Array} - Returns a list of taskSubtask objects associated with the current task
     */
    async getTaskSubtaskList(){
        const fb = new FirebaseDatabase();
        const dataArray = await fb.getFirebaseLogin(() => fb.getAllData('taskSubtask'));
        const taskToSubtaskList = dataArray.filter(x => x['maintaskID'] == this.task['id']);
        const subtaskListDB = await this.getSubtaskListDb(taskToSubtaskList);
        const maxPos = this.getMaxPositionOfSubtaskDbList(subtaskListDB);
        return [subtaskListDB, taskToSubtaskList, maxPos];
    }

    /**
     * Get a list of subtasks associated with the task
     * @param {Array} taskToSubtaskList - The list of taskToSubtask objects
     * @returns {Array} - Returns a list of subtask objects associated with the task
     */
    async getSubtaskListDb(taskToSubtaskList){
        let currentSubtasks = [];
        const fb = new FirebaseDatabase();
        const dataArray = await fb.getFirebaseLogin(() => fb.getAllData('subTasks'));
        for(let i = 0; i < taskToSubtaskList.length; i++){
            const subTask = dataArray.find(x => x['id'] == taskToSubtaskList[i]['subTaskID']);
            if(subTask){currentSubtasks.push(subTask);}
        }
        
        return this.orderSubtaskList(currentSubtasks);
    }

    /**
     * Orders the list of subtasks by their position.
     * @param {Array} currentSubtasks - The list of current subtasks.
     * @returns {Array} The ordered list of subtasks.
     */
    orderSubtaskList(currentSubtasks){
        if(currentSubtasks.length == 0){return [];}
        const subTask = currentSubtasks[0];
        if(!subTask.hasOwnProperty('position')){return currentSubtasks;}
        return currentSubtasks.sort((a, b) => a.position - b.position);
    }

    /**
     * Gets the maximum position of subtasks.
     * @param {Array} subtaskListDB - The list of subtask objects.
     * @returns {number} The maximum position of the subtasks.
     */
    getMaxPositionOfSubtaskDbList(subtaskListDB){
        const util = new AddTaskUtils();
        const maxPos = util.getMaxPositionOfSubtasks(subtaskListDB);
        return maxPos;
    }

    /**
     * Remove contacts from the task's contact list
     * @param {Array} contactListForRemove - The list of contacts to remove
     * @param {Array} taskContaktAssignedList - The list of taskContactAssigned objects
     * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise
     */
    async removeContactsTaskAssociation(contactListForRemove, taskContaktAssignedList){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < contactListForRemove.length; i++){
            const taskToContact = taskContaktAssignedList.find(x => x['contactId'] == contactListForRemove[i]['id']);
            if(!taskToContact){continue;}
            const result = await fb.getFirebaseLogin(() => fb.deleteData(`taskContactAssigned/${taskToContact['id']}`));
            if(!result){return false;}
        }

        return true;
    }

    /**
     * Get a list of contacts to add to the task
     * @param {Array} contactListForAdd - The list of contacts to add
     * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise
     */
    async addContactsTaskAssociation(contactListForAdd){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < contactListForAdd.length; i++){
            const caID = getNewUid();
            const ca = new ContactAssigned(caID, this.task['id'], contactListForAdd[i]['id']);
            const result = await fb.getFirebaseLogin(() => fb.putData(`taskContactAssigned/${caID}`, ca));
            if(!result){return false;}
        }

        return true;
    }

    /**
     * Remove subtasks from the task's subtask list
     * Remove the subtasks themselves from the database
     * @param {Array} subtasksForRemove - The list of subtasks to remove
     * @param {Array} taskToSubtasksList - The list of taskSubtask objects
     * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise
     */
    async removeSubtasksFromTask(subtasksForRemove, taskToSubtasksList){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < subtasksForRemove.length; i++){
            const taskToSubtask = taskToSubtasksList.find(x => x['subTaskID'] == subtasksForRemove[i]['id']);
            if(!taskToSubtask){continue;}
            const resultRemoveAssociation = await fb.getFirebaseLogin(() => fb.deleteData(`taskSubtask/${taskToSubtask['id']}`));
            if(!resultRemoveAssociation){return false;}
            const resultRemoveSubtask = await fb.getFirebaseLogin(() => fb.deleteData(`subTasks/${subtasksForRemove[i]['id']}`));
            if(!resultRemoveSubtask){return false;}
        }
        return true;
    }

    /**
     * Get a list of new subtasks to add to the task
     * Adds the subtasks themselves to the database
     * @param {Array} newSubtasks - The list of new subtasks to add
     * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise
     */
    async addNewSubtasksToTask(newSubtasks, maxPos){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < newSubtasks.length; i++){
            maxPos++;
            const subTask = new Subtask(newSubtasks[i]['id'], newSubtasks[i]['title'], false, maxPos);
            const subTaskToTask = new SubtaskToTask(getNewUid(), this.task['id'], subTask.id);
            const resultSubtask = await fb.getFirebaseLogin(() => fb.putData(`subTasks/${subTask.id}`, subTask));
            if(!resultSubtask){return false;}
            const resultTaskToSubstask = await fb.getFirebaseLogin(() => fb.putData(`taskSubtask/${subTaskToTask.id}`, subTaskToTask));
            if(!resultTaskToSubstask){return false};
        }
        return true;
    }

    /**
     * Update the task with the given data
     * @param {Object} editTask - The task data to update
     * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise
     */
    async updateTask(editTask){
        const fb = new FirebaseDatabase();
        const resultUpdate = await fb.getFirebaseLogin(() => fb.putData(`tasks/${editTask.id}`, editTask));
        return resultUpdate;
    }

    /**
     * Update the current subtasks in the database
     * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise
     */
    async updateCurrentSubtasks(){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < this.currentSubtasks.length; i++){
            const resultUpdate = await fb.getFirebaseLogin(() => fb.updateData(`subTasks/${this.currentSubtasks[i]['id']}`, {'title' : `${this.currentSubtasks[i]['title']}`}));
            if(!resultUpdate){return false;}
        }
        return true;
    }

    

}