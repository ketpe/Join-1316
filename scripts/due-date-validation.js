

/**
 * Start of validation of the due date;
 */
function startDueDateValidation() {
    let dateField = document.getElementById('due-date-display');

    if (dateField.value) {
        checkTheDateValue(dateField.value);

    } else {
        showAndLeaveErrorMessage("a-t-due-date-required", true);
        showAndLeaveErrorBorder("due-date-display", true);
    }
}

/**
 * Check the date value. Remove any spaces.
 * @param {string} dateValue 
 * @returns 
 */
function checkTheDateValue(dateValue) {

    const dateCleanValue = (dateValue ?? "").trim();

    if (currentDueDate === dateCleanValue) { return; }

    if ((dateCleanValue.length == 10 && !checkIsCorrectDate(dateCleanValue)) || dateCleanValue.length > 10) {
        dueDateSetError();
    } else if (dateCleanValue.length < 10) {
        checkDateCharSet(dateCleanValue)
        dueDateSetError();
    } else  {
        dueDateSetOk();
    }

    currentDueDate = dateCleanValue;
}

/**
 * Check whether the date value conforms to the format. 
 * Split the string into its individual date components. 
 * Then attempt to convert them to numbers. 
 * Create a date from these numbers; this date cannot be in the past. 
 * Finally, the date components from the created date are compared with the components of the passed date. 
 * If they are equal, it returns true; otherwise, it returns false.
 * @param {string} valueToCheck 
 * @returns 
 */
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

/**
 * Convert date components from regex array to integers.
 * @param {RegExpMatchArray} matchDateWithRegex 
 * @returns day, month, year as number
 */
function getDatePartsOfDateValue(matchDateWithRegex) {
    const day = parseInt(matchDateWithRegex[1], 10);
    const month = parseInt(matchDateWithRegex[2], 10) - 1;
    const year = parseInt(matchDateWithRegex[3], 10);
    return [day, month, year];
}

/**
 * The date format is iterated over and checked to see if the characters are numbers. 
 * A '/' is inserted at the 2nd and 5th positions if one isn't already present.
 * @param {string} dateValueString 
 * @returns true or false
 */
function checkDateCharSet(dateValueString) {

    for (let i = 0; i < dateValueString.length; i++) {

        if (i == 2 || i == 5) {
            if (dateValueString[i] !== "/") {
                break;
            } else {
                continue;
            }
        }

        if (!isNumeric(dateValueString[i])) {break; }

        if (dateValueString.length == 2 || dateValueString.length == 5) {
            concatDateValue(dateValueString);
            break;
        }
    }

}

/**
 * Insert the '/' after the user input.
 * @param {string} dateValue 
 */
function concatDateValue(dateValue) {
    dateValue = dateValue + "/";
    document.getElementById('due-date-display').value = dateValue;
    currentDueDate = dateValue;
}

/**
 * Test whether the character is a number.
 * @param {string} n 
 * @returns true or false
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


/**
 * Highlight the date field so the user can see that their entry was invalid.
 */
function dueDateSetError() {
    showAndLeaveErrorMessage("a-t-due-date-required", true);
    showAndLeaveErrorBorder("due-date-display", true);
}

/**
 * The date is correct. Display the date field with normal formatting.
 */
function dueDateSetOk() {
    showAndLeaveErrorMessage("a-t-due-date-required", false);
    showAndLeaveErrorBorder("due-date-display", false);
}