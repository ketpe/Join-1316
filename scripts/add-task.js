
async function onLoadAddTask(){
    await renderAddTaskWithNavAndHeader();
    changeAddTaskViewToStandard()
}


async function renderAddTaskWithNavAndHeader() {

    await Promise.all([
        includeHtml("navbar", "navbar-desktop.html"),
        includeHtml("header", "header-desktop.html"),
        includeHtml("add-task-content", "add-task.html")
    ]);
  
}



function changeAddTaskViewToStandard() {
    document.getElementById('a-t-dialog-close-btn').classList.add('display-hidden');
    document.getElementById('a-t-cancel-btn').classList.add('display-hidden');
    document.getElementById('a-t-clear-btn').classList.remove('display-hidden');
    document.getElementById('add-task-form').classList.add('add-task-form-desktop');
    document.getElementById('add-task-form').classList.remove('add-task-form-dialog');
}


function dateFieldOnFocus() {
    let dateField = document.getElementById('task-due-date');

    let t = dateField.getAttribute('type');

    console.log(t);

    dateField.setAttribute('type', 'date');

    console.log(dateField);
    

    /* if(dateField.type !== 'date'){
        dateField.type == 'date';
    }

    console.log(dateField); */
}