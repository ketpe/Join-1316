
//FIXME - Dialoge könnten mit add-task-dialog zusammengelegt werden
function onAddContactDialogOpen() {
    toggleScrollOnBody();
    addDialogShowClass();
    document.getElementById('add-contact-dialog').showModal();
    renderAddContactIntoDialog();
}

function addContactDialogClose(event) {

    const dialog = document.getElementById('add-contact-dialog');
    const closeDiv = document.getElementById('btn-overlay-close-contacts');
    if (event.target == dialog || event.target == closeDiv) {
        addDialogHideClass();
        setTimeout(function () {
            dialog.close();
            toggleScrollOnBody();
        }, 1000);

    }
}

function toggleScrollOnBody() {
    document.getElementsByTagName('body')[0].classList.toggle('dialog-open');
}


function renderAddContactIntoDialog() {
    includeHtml("dialog-content-contacts", "add-contact.html");
}

function addDialogShowClass() {
    let dialog = document.getElementById('add-contact-dialog');
    dialog.classList.remove('dialog-hide');
    dialog.classList.add('dialog-show');
}

function addDialogHideClass() {
    let dialog = document.getElementById('add-contact-dialog');
    dialog.classList.remove('dialog-show');
    dialog.classList.add('dialog-hide');
}