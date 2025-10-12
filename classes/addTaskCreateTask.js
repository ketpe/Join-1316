/**
 * addTaskCreateTask.js
 *
 * This module handles the creation of a new task, including its subtasks and assigned contacts.
 * It utilizes helper classes to structure the data and interacts with the database to store the information.
 * The main class, CreateNewTask, orchestrates the process of creating a task, adding subtasks,
 * and associating contacts.
 *
 * The module also includes utility functions for generating unique IDs and managing database operations.
 * It is designed to be used in conjunction with a user interface that collects task details from the user.
 * The module ensures that all necessary data is properly formatted and stored in the database.
 *
 * Dependencies:
 * - db-functions.js: For database operations such as PUT and DELETE.
 * - addTaskUtils.js: For utility functions related to task management.
 *
 * Usage:
 * const newTask = new CreateNewTask(taskData, subtaskData, contactData);
 * await newTask.start();
 *
 * The above example creates a new task with the provided data and stores it in the database.
 * The taskData, subtaskData, and contactData should be structured according to the expected formats.
 *
 * Note: This module does not handle user interface elements or event listeners.
 * It focuses solely on the logic and data management for task creation.
 * It is assumed that the necessary data validation and user input handling are performed elsewhere in the application.
 */

class CreateNewTask {
    constructor(task, subtasks, contactAssignArray, currentUserId) {
        this.task = task;
        this.subtasks = subtasks;
        this.contactAssignArray = contactAssignArray;
        this.currentUserId = currentUserId;
    }

    /**
     * Starts the task creation process by creating subtasks and associating contacts.
     * This method orchestrates the sequence of operations needed to fully set up a new task.
     * It first creates an array of subtasks, then associates contacts with the task,
     * and finally connects the subtasks to the task before storing everything in the database.
     * @returns {Promise<void>} A promise that resolves when the task creation process is complete.
     */
    async start() {
        await this.addTaskCreateSubtaskArray(this.task);
    }

    /**
     * Creates an array of subtasks for the current task.
     * This method iterates over the provided subtasks, creating a new Subtask object for each one.
     * It then calls the method to associate contacts with the task, passing along the current task and the array of subtasks.
     * @returns {Promise<void>} A promise that resolves when the subtasks have been created and associated with contacts.
     * @param {*} currentTask
     */
    async addTaskCreateSubtaskArray(currentTask) {
        let subTaskArray = [];
        for (let i = 0; i < this.subtasks.length; i++) {
            subTaskArray.push(new Subtask(getNewUid(), this.subtasks[i]['title'], false, this.subtasks[i]['position']));
        }

        await this.addTaskContactAssigned(currentTask, subTaskArray);
    }

    /**
     * Associates contacts with the current task.
     * This method creates an array of ContactAssigned objects, including any additional contacts.
     * @param {Task} currentTask
     * @param {Array} subTaskArray  Array of subtasks to be associated with the task.
     * @returns {Promise<void>} A promise that resolves when the contacts have been associated with the task.
     */
    async addTaskContactAssigned(currentTask, subTaskArray) {

        let newContactAssignedArray = [];

        // newContactAssignedArray.push(new ContactAssigned(getNewUid(), currentTask.id, this.currentUserId));

        for (let i = 0; i < this.contactAssignArray.length; i++) {
            newContactAssignedArray.push(new ContactAssigned(getNewUid(), currentTask.id, this.contactAssignArray[i]['id']));
        }

        await this.subtaskToTaskConnection(currentTask, subTaskArray, newContactAssignedArray);
    }

    /**
     * Connects subtasks to the main task and assigns contacts to the task.
     * This method creates an array of SubtaskToTask objects to establish the relationship between the main task and its subtasks.
     * It then calls the method to write all collected data to the database.
     * @returns {Promise<void>} A promise that resolves when the subtasks have been connected to the task and all data has been written to the database.
     * @param {Task} currentTask
     * @param {Array} subTaskArray
     * @param {Array} assignedContactArray
     */
    async subtaskToTaskConnection(currentTask, subTaskArray, assignedContactArray) {
        let subtaskToTaskArray = [];

        for (let i = 0; i < subTaskArray.length; i++) {
            subtaskToTaskArray.push(new SubtaskToTask(getNewUid(), currentTask.id, subTaskArray[i]['id']));
        }

        await this.addTaskCreateDBEntries(currentTask, subTaskArray, assignedContactArray, subtaskToTaskArray)
    }

    /**
     * Writes the task, subtasks, assigned contacts, and subtask-to-task relationships to the database.
     * This method performs the necessary database operations to store all relevant data for the new task.
     * @param {Task} currentTask
     * @param {Array} subTaskArray
     * @param {Array} assignedContactArray
     * @param {Array} subtaskToTaskArray
     * @returns {Promise<void>} A promise that resolves when all data has been written to the database.
     */
    async addTaskCreateDBEntries(currentTask, subTaskArray, assignedContactArray, subtaskToTaskArray) {
        const fb = new FirebaseDatabase();
        await fb.getFirebaseLogin(() => fb.putData(`/tasks/${currentTask.id}`, currentTask));

        for (let subIndex = 0; subIndex < subTaskArray.length; subIndex++) {
            await fb.getFirebaseLogin(() => fb.putData(`/subTasks/${subTaskArray[subIndex].id}`, subTaskArray[subIndex]));
        }

        for (let contactIndex = 0; contactIndex < assignedContactArray.length; contactIndex++) {
            await fb.getFirebaseLogin(() => fb.putData(`/taskContactAssigned/${assignedContactArray[contactIndex].id}`, assignedContactArray[contactIndex]));
        }

        for (let subToTaskIndex = 0; subToTaskIndex < subtaskToTaskArray.length; subToTaskIndex++) {
            await fb.getFirebaseLogin(() => fb.putData(`/taskSubtask/${subtaskToTaskArray[subToTaskIndex].id}`, subtaskToTaskArray[subToTaskIndex]));
        }

    }

}