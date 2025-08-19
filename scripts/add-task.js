let currentDueDate = "";


async function onLoadAddTask() {
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

}

/* function dateFieldOnLostFocus() {
    let dateField = document.getElementById('due-date-display');

} */

function dateFieldOnChange() {
    let dateField = document.getElementById('due-date-display');

    if (dateField.value) {
        checkAndFillDateValue(dateField.value);

    } else {
        showAndLeaveErrorMessage("a-t-due-date-required", true);
        showAndLeaveErrorBorder("due-date-display", true);
    }

}

function onDateIconClick() {
    let datePicker = document.getElementById('due-date-hidden');
    datePicker.showPicker();
}

function datePickerSelectionChange(e) {
    let newDateArr = String(e.target.value).split('-');
    let newDateString = `${newDateArr[2]}/${newDateArr[1]}/${newDateArr[0]}`;
    document.getElementById('due-date-display').value = newDateString;
    dateFieldOnChange();

}

function showAndLeaveErrorMessage(messageTarget, visibilty = true) {
    let errorField = document.getElementById(messageTarget);
    if (errorField == null) { return; }
    if (visibilty) {
        errorField.classList.remove("error-text-hidden");
        errorField.classList.add('error-text-show');
    } else {
        errorField.classList.add("error-text-hidden");
        errorField.classList.remove('error-text-show');
    }
}

function showAndLeaveErrorBorder(inputTarget, visibilty = true) {
    let inputField = document.getElementById(inputTarget);
    if (inputField == null) { return; }
    if (visibilty) {
        inputField.classList.add('input-has-error');
    } else {
        inputField.classList.remove('input-has-error');
    }
}


function checkAndFillDateValue(dateValue) {

    if (currentDueDate === dateValue) { return; }

    if ((dateValue.length == 10 && !checkIsCorrectDate(dateValue)) || dateValue.length > 10 ) {
        showAndLeaveErrorMessage("a-t-due-date-required", true);
        showAndLeaveErrorBorder("due-date-display", true);
        console.log("nicht richtig");
    } else if (dateValue.length < 10) {

        if (!checkDateCharSet(dateValue)) {
            showAndLeaveErrorMessage("a-t-due-date-required", true);
            showAndLeaveErrorBorder("due-date-display", true);
            console.log("nicht richtig");
        } 

    } else{
        showAndLeaveErrorMessage("a-t-due-date-required", false);
            showAndLeaveErrorBorder("due-date-display", false);
            console.log("richtig");
    }

    currentDueDate = dateValue;
}


function checkDateCharSet(dateValueString) {

    for (let i = 0; i < dateValueString.length; i++) {

        if(i == 2 || i == 5){
            if(dateValueString[i] !== "/"){
                return false;
            }else{
                continue;
            }
        }

        if (!isNumeric(dateValueString[i])) { return false; }

        if(dateValueString.length == 2 || dateValueString.length == 5){
            concatDateValue(dateValueString);
            break;
        }
    }

    return true;
}


function concatDateValue(dateValue) {
    dateValue = dateValue + "/";
    document.getElementById('due-date-display').value = dateValue;
    currentDueDate = dateValue;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkIsCorrectDate(valueToCheck) {
    const regexString = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const matchDateWithRegex = valueToCheck.match(regexString);
    if (!matchDateWithRegex) { return false; }

    const dateAsParts = getDatePartsOfDateValue(matchDateWithRegex);
    const valueDate = new Date(dateAsParts[2], dateAsParts[1], dateAsParts[0]);

    if (valueDate < Date.now()) { return false; }

    return (
        valueDate.getFullYear() === dateAsParts[2] &&
        valueDate.getMonth() === dateAsParts[1] &&
        valueDate.getDate() === dateAsParts[0]
    );

}

function getDatePartsOfDateValue(matchDateWithRegex) {
    const day = parseInt(matchDateWithRegex[1], 10);
    const month = parseInt(matchDateWithRegex[2], 10) - 1;
    const year = parseInt(matchDateWithRegex[3], 10);
    return [day, month, year];
}