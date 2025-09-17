class DueDateCheck {

    dueDate = "";
    result = false;

    constructor(dueDateValue, currentDueDate, taskComponents) {
        this.dueDateValue = dueDateValue;
        this.currentDueDate = currentDueDate;
        this.taskComponents = taskComponents;
    }

    startDueDateValidation() {
        if (this.dueDateValue) {
            this.checkTheDateValue(this.dueDateValue);
        } else {
            this.dueDateSetError();
            return [this.result = false, ""];
        }
        
        return [this.result = true, this.dueDate];
    }


    checkTheDateValue(dateValue) {

        const dateCleanValue = (dateValue ?? "").trim();

        if (this.currentDueDate === dateCleanValue) {
            this.dueDate = this.currentDueDate;
            this.result = true;
            return; 
        }

        if ((dateCleanValue.length == 10 && !this.checkIsCorrectDate(dateCleanValue)) || dateCleanValue.length > 10) {
            this.dueDateSetError();
        } else if (dateCleanValue.length < 10) {
            this.checkDateCharSet(dateCleanValue)
            this.dueDateSetError();
        } else {
            this.dueDateSetOk();
        }

        this.dueDate = dateCleanValue;
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
    checkIsCorrectDate(valueToCheck) {
        const regexString = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const matchDateWithRegex = valueToCheck.match(regexString);
        if (!matchDateWithRegex) { return false; }

        const dateAsParts = this.getDatePartsOfDateValue(matchDateWithRegex);
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
    getDatePartsOfDateValue(matchDateWithRegex) {
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
    checkDateCharSet(dateValueString) {

        for (let i = 0; i < dateValueString.length; i++) {

            if (i == 2 || i == 5) {
                if (dateValueString[i] !== "/") {
                    break;
                } else {
                    continue;
                }
            }

            if (!this.isNumeric(dateValueString[i])) { break; }

            if (dateValueString.length == 2 || dateValueString.length == 5) {
                this.concatDateValue(dateValueString);
                break;
            }
        }

    }

    /**
     * Insert the '/' after the user input.
     * @param {string} dateValue 
     */
    concatDateValue(dateValue) {
        dateValue = dateValue + "/";
        document.getElementById('due-date-display').value = dateValue;
        this.dueDate = dateValue;
    }

    /**
     * Test whether the character is a number.
     * @param {string} n 
     * @returns true or false
     */
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //FIXME - prüfen Kommt aus der taskComponent

    /**
     * Highlight the date field so the user can see that their entry was invalid.
     */
    dueDateSetError() {
        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", true);
        this.taskComponents.showAndLeaveErrorBorder("due-date-display", true);
        this.result = false;
    }

    /**
     * The date is correct. Display the date field with normal formatting.
     */
    dueDateSetOk() {
        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", false);
        this.taskComponents.showAndLeaveErrorBorder("due-date-display", false);
        this.result = true;
    }

}