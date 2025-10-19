/**
 * Class for validating and managing due date input for tasks.
 * Ensures the due date is in the correct format (DD/MM/YYYY) and not in the past.
 * Provides feedback to the user through UI components.
 */

class DueDateCheck {

    dueDate = "";
    result = false;

    /**
     * Creates an instance of the DueDateCheck class.
     * @param {string} dueDateValue - The due date value to validate.
     * @param {string} currentDueDate - The current due date value.
     * @param {Object} taskComponents - The task components for UI feedback.
     */
    constructor(dueDateValue, currentDueDate, currentInputValue, taskComponents) {
        this.dueDateValue = dueDateValue;
        this.currentDueDate = currentDueDate;
        this.taskComponents = taskComponents;
        this.currentInputValue = currentInputValue;
    }

    /**
     * Starts the due date validation process.
     * @returns {Array} The validation result and the due date.
     */
    startDueDateValidation() {
        if (this.dueDateValue) {
            return [this.checkTheDateValue(this.dueDateValue), this.dueDate];
        } else {
            this.dueDateSetError();
            return [this.result = false, ""];
        }
    }

    /**
     * Checks the validity of the provided date value.
     * @param {string} dateValue - The date value to check.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    checkTheDateValue(dateValue) {

        const dateCleanValue = (dateValue ?? "").trim();

        if (this.currentDueDate === dateCleanValue) {
            this.dueDate = this.currentDueDate;
            return true; 
        }

        if ((dateCleanValue.length == 10 && !this.checkIsCorrectDate(dateCleanValue)) || dateCleanValue.length > 10) {
            this.dueDateSetError();
            return false;
        } else if (dateCleanValue.length < 10) {
            this.checkDateCharSet(dateCleanValue)
            this.dueDateSetError();
            return false;
        } else {
            this.dueDate = dateCleanValue;
            this.dueDateSetOk();
            return true;
        }

        
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
     * Check the character set of the date value string.
     * This function checks if the date value string contains only valid characters (digits and slashes).
     * @param {string} dateValueString 
     * @returns {void}
     */
    checkDateCharSet(dateValueString) {

        if(this.currentInputValue.length >= dateValueString.length){return;}
        const dateValueClean = dateValueString.replace(/\D/g, "");
        let constructedDate = "";

        for (let i = 0; i < dateValueClean.length; i++){
            if (i == 2 || i == 4){
                constructedDate += `/${dateValueClean[i]}`;
            }else{
                constructedDate += `${dateValueClean[i]}`;
            }
        }

        this.setConstructedDateIntoTheField(constructedDate);
        
    }

    /**
     * Sets the constructed date into the display field and updates the dueDate property.
     * @param {string} cDate - The constructed date string to set.
     */
    setConstructedDateIntoTheField(cDate){
        document.getElementById('due-date-display').value = cDate;
        this.dueDate = cDate;
    }
    
    /**
     * Test whether the character is a number.
     * @param {string} n 
     * @returns true or false
     */
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

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