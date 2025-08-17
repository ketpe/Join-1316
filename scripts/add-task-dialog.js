async function onAddTaskDialogOpen() {
    toggleScrollOnBody();
    addDialogShowClass();
    document.getElementById('add-task-dialog').showModal();
    await renderAddTaskIntoDialog();
    changeAddTaskViewToDialog();
}

function addTaskDialogClose(event) {

    const dialog = document.getElementById('add-task-dialog');
    const closeDiv = document.getElementById('a-t-dialog-close-div');
    if(event.target == dialog || event.target == closeDiv){
        addDialogHideClass();
        setTimeout(function() {
            dialog.close();
            toggleScrollOnBody();
        }, 1000);
  
    }
}

function toggleScrollOnBody() {
    document.getElementsByTagName('body')[0].classList.toggle('dialog-open');
}


async function renderAddTaskIntoDialog() {
    await Promise.all([
        includeHtml("dialog-content", "add-task.html")
    ]);
}

function changeAddTaskViewToDialog() {
    document.getElementById('a-t-dialog-close-btn').classList.remove('display-hidden');
    document.getElementById('a-t-cancel-btn').classList.remove('display-hidden');
    document.getElementById('a-t-clear-btn').classList.add('display-hidden');
    document.getElementById('add-task-form').classList.remove('add-task-form-desktop').classList.add('add-task-form-dialog');
}

function addDialogShowClass() {
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

function addDialogHideClass(){
    let dialog = document.getElementById('add-task-dialog');
    dialog.classList.remove('dialog-show');
    dialog.classList.add('dialog-hide');
}