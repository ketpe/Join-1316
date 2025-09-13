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
