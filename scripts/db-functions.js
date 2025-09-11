/**
 * Get all Data from Firebase database by tablename.
 * @param {string} tableName
 * @returns
 */
async function getAllData(tableName = "") {
    let dataArray = [];

    try {
        let response = await fetch(BASE_URL + ".json");
        if (!response.ok) { throw new Error(`Response status: ${response.status}`); }

        const result = await response.json();

        if (result[tableName]) { dataArray = Object.values(result[tableName]).filter(c => c !== null); }
    } catch (error) {
        console.error(error.message);
    }
    return dataArray;
}

function getRandomColor() {
    const colorClasses = [
        'orange', 'violet', 'coral', 'gold', 'lemon', 'red', 'blue',
        'peach', 'cyan', 'pink', 'indigo', 'mint', 'magenta', 'lime', 'amber'
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

/**
 * Get data by searchkey and value of database by tablename.
 * @param {string} key
 * @param {*} values
 * @param {string} tableName
 * @returns
 */
async function getDataByKey(key = "", values, tableName = "") {
    let dataArray = await getAllData(tableName);
    return dataArray.length > 0 ? dataArray.find(x => x[key] == values) : null;
}

/**
 * Put or add data in database by path.
 * @param {string} path
 * @param {*} data
 * @returns
 */
async function putData(path = "", data = {}) {
    let response;

    try {
        response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) { throw new Error(`Response status: ${response.status}`); }

    } catch (error) {
        console.error(`Error put contact: ${error.message}`);
        return;
    }

    return await response.json();
}

/**
 * Remove data by path.
 * @param {string} path
 * @returns
 */
async function deleteData(path = "") {

    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });

        if (!response.ok) { throw new Error(`Response status: ${response.status}`); }

    } catch (error) {
        console.error(error.message);
        return false;
    }

    return true;
}

/**
 * Create a unique id as string.
 * @returns
 */
function getNewUid() {

    return crypto.randomUUID();
}

/**
 * Gets all contacts from the database in a sorted order.
 * @returns
 */

async function getSortedContact() {
    const contacts = await getAllData("contacts");
    let contactssorted = contacts.sort((a, b) => a.firstname.localeCompare(b.firstname));
    return contactssorted
}

async function updateData(path = "", data = {}) {
    let response;

    try {
        response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-HTTP-Method-Override': 'PATCH'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) { throw new Error(`Response status: ${response.status}`); }

    } catch (error) {
        console.error(`Error update contact: ${error.message}`);
        return;
    }

    return await response.json();
}
/*NOTE - Erzeugt Test Task*/
async function createTaskTest() {
    let newTask = {
        'id': getNewUid(),
        'title': 'Kochwelt Page & Recipe Recommender',
        'description': 'Build start page with recipe recommendation.',
        'dueDate': '10/05/2025',
        'priority': 'Urgent',
        'category': '825f2fb0-61c3-4b5c-8b76-dcdaef80c809',
        'taskStateCategory': 'toDo'
    }
    let subTask = {
        'id': getNewUid(),
        'title': 'Implement Recipe Recommendation',
        'taskChecked': false
    }
    let taskContactAssinged = {
        'id': getNewUid(),
        'taskID': newTask['id'],
        'contactId': '3ed92f09-67a6-45e0-a3df-7fc34a71c4f1'
    };
    let taskSubtask = {
        'id': getNewUid(),
        'maintaskID': newTask['id'],
        'subTaskID': subTask['id']
    };
    await putData(`/tasks/${newTask.id}`, newTask);
    await putData(`/subTasks/${subTask.id}`, subTask);
    await putData(`/taskContactAssigned/${taskContactAssinged.id}`, taskContactAssinged);
    await putData(`/taskSubtask/${taskSubtask.id}`, taskSubtask);

}
/*NOTE - Erzeugt Test Subtask*/
async function createSubTaskTest(titeltest, checkstatus, IDfromMaintask) {

    let subTask = {
        'id': getNewUid(),
        'title': titeltest,
        'taskChecked': checkstatus
    }

    let taskSubtask = {
        'id': getNewUid(),
        'maintaskID': IDfromMaintask,
        'subTaskID': subTask['id']
    };
    await putData(`/subTasks/${subTask.id}`, subTask);
    await putData(`/taskSubtask/${taskSubtask.id}`, taskSubtask);
}
/*NOTE - Erzeugt Test Assigned Contact*/
async function createAssignedContactTest(idForTask, idforContact) {
    let taskContactAssinged = {
        'id': getNewUid(),
        'taskID': idForTask,
        'contactId': idforContact
    };
    await putData(`/taskContactAssigned/${taskContactAssinged.id}`, taskContactAssinged);
}


/**
 * Diese Klassen entsprechen den Models der Json Objekte der Firebasedatenbank.
 * These classes correspond to the models of the JSON objects in the Firebase database.
 */

class Task {
    constructor(id, title, description, dueDate, priority, category, taskStateCategory) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.category = category;
        this.taskStateCategory = taskStateCategory;
    }

}

class Subtask {
    constructor(id, title, taskChecked) {
        this.id = id;
        this.title = title;
        this.taskChecked = taskChecked;
    }
}

class ContactAssinged {
    constructor(id, taskID, contactId) {
        this.id = id;
        this.taskID = taskID;
        this.contactId = contactId;
    }
}

class SubstaskToTask {
    constructor(id, maintaskID, subTaskID) {
        this.id = id;
        this.maintaskID = maintaskID;
        this.subTaskID = subTaskID;
    }
}