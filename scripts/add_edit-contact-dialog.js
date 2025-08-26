//FIXME - Dialoge könnten mit add-task-dialog zusammengelegt werden
function onAddContactDialogOpen() {
    toggleScrollOnBody();
    addDialogShowClass();
    document.getElementById('add-contact-dialog').showModal();
    renderAddContactIntoDialog();
}

function addContactDialogClose(event) {
    const dialog = document.getElementById('add-contact-dialog');
    const closeDiv = document.getElementById('btn-overlay-close-div');
    if (
        event.target == dialog ||
        event.target == closeDiv ||
        event.target.closest('.btn-clear-cancel') ||
        event.target.closest('.btn-create')
    ) {
        closeDialog(dialog);
    }
}

function closeDialog(dialog) {
    addDialogHideClass();
    setTimeout(function () {
        dialog.close();
        toggleScrollOnBody();
    }, 1000);

}

function toggleScrollOnBody() {
    document.getElementsByTagName('body')[0].classList.toggle('dialog-open');
}

function renderAddContactIntoDialog() {
    includeHtml("dialog-content-contacts", "add-contact.html");
}

function renderEditContactIntoDialog(id) {
    includeHtml("dialog-content-contacts", "edit-contact.html").then(() => {
        getDataByKey("id", id, "contacts").then(contact => {
            document.getElementById('contact-name').value = `${contact.firstname} ${contact.lastname}`;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-phone').value = contact.phone;
            document.getElementById('initial-avatar').classList.add(contact.initialColor);
            document.querySelector('#initial-avatar .detail-view-initials').innerText = contact.initial;
            document.querySelector('#login-form-buttons .btn-create').id = contact.id;
            document.querySelector('#login-form-buttons .btn-clear-cancel').id = contact.id;
        });
    });
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