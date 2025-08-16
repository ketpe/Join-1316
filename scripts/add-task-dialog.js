function onAddTaskDialogOpen() {
    toggleScrollOnBody();
    addDialogShowClass();
    document.getElementById('add-task-dialog').showModal();
    renderAddTaskIntoDialog();
}

function addTaskDialogClose(event) {
    const dialog = document.getElementById('add-task-dialog');
    if(event.target == dialog){
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


function renderAddTaskIntoDialog() {
    includeHtml("dialog-content", "add-task.html");
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