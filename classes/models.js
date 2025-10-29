/**
 * Represents a task in the system.
 * @class Task
 * @property {string} id - The unique identifier for the task.
 * @property {string} title - The title of the task.
 * @property {string} description - The description of the task.
 * @property {string} dueDate - The due date of the task.
 * @property {string} priority - The priority level of the task.
 * @property {string} category - The category of the task.
 * @property {string} taskStateCategory - The state category of the task.
 * @example
 * const task = new Task(id, title, description, dueDate, priority, category, taskStateCategory);
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

/**
 * Represents a subtask in the system.
 * @class Subtask
 * @property {string} id - The unique identifier for the subtask.
 * @property {string} title - The title of the subtask.
 * @property {boolean} taskChecked - The completion status of the subtask.  
 * @property {number} position - The position of the subtask in the list.
 * @example
 * const subtask = new Subtask(id, title, taskChecked, position);
 */ 
class Subtask {
    constructor(id, title, taskChecked, position) {
        this.id = id;
        this.title = title;
        this.taskChecked = taskChecked;
        this.position = position;
    }
}

/**
 * Represents a contact assigned to a task.
 * @class ContactAssigned
 * @property {string} id - The unique identifier for the contact assignment.
 * @property {string} taskID - The ID of the task to which the contact is assigned.
 * @property {string} contactId - The ID of the contact assigned to the task.
 * @example
 * const contactAssigned = new ContactAssigned(id, taskID, contactId);
 */
class ContactAssigned {
    constructor(id, taskID, contactId) {
        this.id = id;
        this.taskID = taskID;
        this.contactId = contactId;
    }
}

/** 
 * Represents the association between a subtask and its parent task.
 * @class SubtaskToTask
 * @property {string} id - The unique identifier for the subtask-to-task association.
 * @property {string} maintaskID - The ID of the main task.
 * @property {string} subTaskID - The ID of the subtask.
 * @example
 * const subtaskToTask = new SubtaskToTask(id, maintaskID, subTaskID);
 */
class SubtaskToTask {
    constructor(id, maintaskID, subTaskID) {
        this.id = id;
        this.maintaskID = maintaskID;
        this.subTaskID = subTaskID;
    }
}

/** 
 * Represents a contact in the system.
 * @class Contact
 * @property {string} id - The unique identifier for the contact.
 * @property {string} firstname - The first name of the contact.
 * @property {string} lastname - The last name of the contact.
 * @property {string} password - The password of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {string} initial - The initial of the contact.
 * @property {string} initialColor - The color associated with the contact's initial.
 */
class Contact {
    constructor(id, firstname, lastname, password, email, phone, initial, initialColor) {
        this.id = id || getNewUid();
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.email = email;
        this.phone = phone || '';
        this.initial = initial;
        this.initialColor = initialColor || getRandomColor();
    }
}


