/**
 * Utility class for deleting a task and its associated data from the database
 * @class BoardTaskDetailDeleteUtil
 * @property {string} taskId - The ID of the task to be deleted
 * @example
 * const taskDeleter = new BoardTaskDetailDeleteUtil(taskId);
 */


class BoardTaskDetailDeleteUtil {
    constructor(taskId){
        this.taskId = taskId;
    }

    /**
     *  Starts the deletion process for the task and its associated data
     * @returns {boolean} - Returns true if the deletion was successful, otherwise false
     */
    async startDelete(){
        const task = new Task(this.taskId, "", "", "", "", "", "");
        const editTask = new EditTaskSafeUtil(task, "", "", "", "", [], []);
        const [contactsDbList, taskContactDBList] = await editTask.getTaskContactAssignedList();
        const [subtaskDbList, taskToSubtaskDBList, maxPos] = await editTask.getTaskSubtaskList();

        if(!this.removeDataInArrayFromDB(taskContactDBList, 'taskContactAssigned')){return false;}
        if(!this.removeDataInArrayFromDB(taskToSubtaskDBList, 'taskSubtask')){return false;}
        if(!this.removeDataInArrayFromDB(subtaskDbList, 'subTasks')){return false;}
        if(!this.removeTaskFromDb(this.taskId)){return false;}

        return true;
    }


    /**
     * Removes data from a specific table in the database
     * @param {Array} dataArray - The array of data to remove
     * @param {string} tablename - The name of the table to remove data from
     * @returns {boolean} - Returns true if the removal was successful, otherwise false
     */
    async removeDataInArrayFromDB(dataArray, tablename){
        const fb = new FirebaseDatabase();
        for(let i = 0; i < dataArray.length; i++){
            const resultDelete = await fb.getFirebaseLogin(() => fb.deleteData(`${tablename}/${dataArray[i]['id']}`));
            if(!resultDelete){return false;}
        }
        return true;
    }

    /**
     * Removes a task from the database
     * @param {string} taskId - The ID of the task to remove
     * @returns {boolean} - Returns true if the removal was successful, otherwise false
     */
    async removeTaskFromDb(taskId){
        const fb = new FirebaseDatabase();
        const resultDelete = await fb.getFirebaseLogin(() => fb.deleteData(`tasks/${taskId}`));
        return resultDelete;
    } 

    

}