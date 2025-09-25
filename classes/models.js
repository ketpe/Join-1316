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
    constructor(id, title, taskChecked, position) {
        this.id = id;
        this.title = title;
        this.taskChecked = taskChecked;
        this.position = position;
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

class Contact{
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


