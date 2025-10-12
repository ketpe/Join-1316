/**
 * Represents a task in the system.
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


