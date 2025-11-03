/**
 * @fileoverview
 * @namespace boardDatabase
 * @description Functions for interacting with the database to fetch and manipulate board data.
 */

/**
 * @function getBoardTasks
 * @memberof boardDatabase
 * @description Fetches tasks from the database, processes them, and renders them on the Kanban board. Also updates the board size and styles assigned contacts.
 * @returns {Promise<void>} - A promise that resolves when the tasks have been fetched and rendered.
*/
async function getBoardTasks() {
    const [taskToDo, taskInProgress, taskAwaitingFeedback, taskDone] = getHtmlTasksContent();
    const fb = new FirebaseDatabase();
    tasks = await fb.getFirebaseLogin(() => fb.getAllData("tasks"));
    tasks = await getDatabaseTaskCategory(tasks);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    onBoardPageResize();
    renderBoardtasks(tasks, taskToDo, taskInProgress, taskAwaitingFeedback, taskDone);
    addLeftPositionStyleassignedContacts();
    setNavigationButtonActive('board', "desktop");
    hideAllDropzones();
}

/**
 * @function getDatabaseTaskCategory
 * @memberof boardDatabase
 * @description Retrieves the task categories from the database for the given tasks.
 * @param {Array} tasks - The list of tasks to retrieve categories for.
 * @returns {Promise<Array>} - The updated list of tasks with category data.
 */
async function getDatabaseTaskCategory(tasks) {
    for (let task of tasks) {
        const fb = new FirebaseDatabase();
        const categoryData = await fb.getFirebaseLogin(() => fb.getDataByKey("id", task['category'], "categories"));
        task.categoryData = categoryData;
    }
    return tasks;
}

/**
 * @function getDatabaseTaskSubtasks
 * @memberof boardDatabase
 * @description Retrieves the subtasks from the database for the given tasks.
 * @param {Array} tasks - The list of tasks to retrieve subtasks for.
 * @returns {Promise<Array>} - The updated list of tasks with subtask data.
 */
async function getDatabaseTaskSubtasks(tasks) {
    const fb = new FirebaseDatabase();
    let getAllTaskSubtasks = await fb.getFirebaseLogin(() => fb.getAllData('taskSubtask'));
    let getAllSubtasks = await fb.getFirebaseLogin(() => fb.getAllData('subTasks'));
    tasks.forEach(task => {
        let taskSubTasks = getAllTaskSubtasks.filter(obj => obj.maintaskID === task.id);
        let subTasks = [];
        taskSubTasks.forEach(taskSubTask => {
            let foundSubTask = getAllSubtasks.find(obj => obj.id === taskSubTask.subTaskID);
            if (foundSubTask) subTasks.push(foundSubTask);
        });
        task.subTasks = getSortedSubTask(subTasks);
    });
    tasks = getSubTaskSumOfTrue(tasks);
    return tasks;
}

/**
 * @function getSortedSubTask
 * @memberof boardDatabase
 * @description Retrieves the sorted subtask array.
 * @returns {Array} The sorted subtask array.
 */
function getSortedSubTask(subtaskArray) {
    if (!subtaskArray || subtaskArray.length == 0) { return []; }
    const sortedSubTasks = subtaskArray.sort((a, b) => a.position - b.position);
    return sortedSubTasks;
}

/**
 * @function getSubTaskSumOfTrue
 * @memberof boardDatabase
 * @description Calculates the sum of true subtasks for each task.
 * @param {Array} tasks - The list of tasks to process.
 * @returns {Array} - The updated list of tasks with the count of true subtasks.
 */
function getSubTaskSumOfTrue(tasks) {
    tasks.forEach(task => {
        if (Array.isArray(task.subTasks)) {
            task.countTrueSubtasks = task.subTasks.filter(sT => sT.taskChecked === true).length;
        } else {
            task.countTrueSubtasks = 0;
        }
    });
    return tasks;
}

/**
 * @function getDatabaseTaskContact
 * @memberof boardDatabase
 * @description Retrieves the assigned contacts from the database for the given tasks.
 * @param {Array} tasks - The list of tasks del retrieve assigned contacts for.
 * @returns {Promise<Array>} - The updated list of tasks with assigned contact data.
 */
async function getDatabaseTaskContact(tasks) {
    const fb = new FirebaseDatabase();
    let getAllAssignedContacts = await fb.getFirebaseLogin(() => fb.getAllData('taskContactAssigned'));
    let getAllContacts = await fb.getFirebaseLogin(() => fb.getAllData('contacts'));
    tasks.forEach(task => {
        let assignedContacts = getAllAssignedContacts.filter(obj => obj.taskID === task.id)
        let contacts = [];
        assignedContacts.forEach(assContact => {
            let contact = getAllContacts.filter(obj => obj.id === assContact.contactId)
            if (contact) contacts.push(contact);
        })
        task.assignedContacts = getSortedContact(contacts);
    })
    return tasks;
}

/**
 * @memberof boardDatabase
 * @function getSortedContact
 * @description Sorts contacts by first name.
 * @param {Array} contacts
 * @returns {Array} - The sorted array of contacts.
 */

function getSortedContact(contacts) {
    console.log(contacts);

    let flatContacts = contacts.flat(); // Glättet das Array, nimmt die Verschachtelung raus
    let sorted = flatContacts.sort((a, b) => a.firstname.localeCompare(b.firstname)); //Sortiert dann das Array
    let structured = sorted.map(obj => [obj]); // Verschatelt das Array wieder
    return structured; // theroretisch kann die Verschachtelung vorher entfernt werden, man muus sie nur auch beim erstellen der Tasks rausnehmen

}

/**
 * @function getTaskByTaskID
 * @memberof boardDatabase
 * @description Fetches a task by its ID.
 * @param {string} taskId - The ID of the task to fetch
 * @returns {Promise<Array>} - A promise that resolves to an array of task objects
 */
async function getTaskByTaskID(taskId) {
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getDataByKey("id", taskId, "tasks"));
    tasks = await getDatabaseTaskCategory([tasks]);
    tasks = await getDatabaseTaskSubtasks(tasks);
    tasks = await getDatabaseTaskContact(tasks);
    return tasks;
}
