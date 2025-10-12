const BASE_URL = "https://join-1316-default-rtdb.europe-west1.firebasedatabase.app/";

let contact = {
    'id' : 'eine UID',
    'firstname': '',
    'lastname' : '',
    'password': '',
    'email' : '',
    'phone' : '',
    'initial' : 'AM',
    'initialColor' : '--bg-test'
};

let questContact = {

};

let categories = {
    'id': 1,
    'title' :'',
    'categoryColor' : ''
};

//Die 'category' kommt aus der 'category.id' Beziehung 1 : 1
let task = {
    'id' : 1,
    'title' : '',
    'description' : '',
    'dueDate' : '',
    'priority' : '',
    'category' : '',
    'taskStateCategory': 'todo'
};

let subTask = {
    'id' : 1,
    'title' : '',
    'taskChecked' : false
};

//Jeder Task mit einen oder mehrere Kontakten haben. Beispiel Task:1 und Contact:2 / Task:1 und Contact:3 Beziehung 1 > n
let taskContactAssigned = {
    'id': 112,
    'taskID': 1,
    'contatactId' : 1
};

//Jeder Task kann einen oder mehrere Subtasks haben Beziehung 1 > n
let taskSubtask = {
    'id': 123,
    'maintaskID':1,
    'subTaskID' :2
};



