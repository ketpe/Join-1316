/**
 * @description Class for validating and managing due date input for tasks.
 * Ensures the due date is in the correct format (DD/MM/YYYY) and not in the past.
 * Provides feedback to the user through UI components.
 * @class DueDateCheck
 * @property {string} dueDateValue - The due date value to validate.
 * @property {string} currentDueDate - The current due date value.
 * @property {Object} taskComponents - The task components for UI feedback.
 * @property {string} currentInputValue - The current input value in the due date field.
 * @property {string} dueDate - The validated due date.
 * @property {boolean} result - The result of the due date validation.
 */

class DueDateCheck {

    dueDate = "";
    result = false;

    /**
     * Creates an instance of the DueDateCheck class.
     * @param {string} dueDateValue - The due date value to validate.
     * @param {string} currentDueDate - The current due date value.
     * @param {Object} taskComponents - The task components for UI feedback.
     * @param {string} currentInputValue - The current input value in the due date field.
     */
    constructor(dueDateValue, currentDueDate, currentInputValue, taskComponents) {
        this.dueDateValue = dueDateValue;
        this.currentDueDate = currentDueDate;
        this.taskComponents = taskComponents;
        this.currentInputValue = currentInputValue;


    }

    /**
     * Checks the validity on input of the provided date value.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    checkTheDateValueOnInput() {
        if(this.dueDateValue.length !== this.dueDateValue.replace(/\s/g, "").length){
            this.dueDateSetError("Spaces are not allowed");
            return [false, ""];
        }
        const dateCleanValue = (this.dueDateValue ?? "").trim();

        if (this.currentDueDate === dateCleanValue) {
            this.dueDate = this.currentDueDate;
            return [true, this.dueDate];
        }

        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", false);
        this.checkDateCharSet(dateCleanValue);

        return [true, this.dueDate];
    }

    /**
     * Checks the validity after input or lost focus of the provided date value.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    checkTheDateAfterInput(){
        const isDateOk = this.checkTheDateValue();
        //isDateOk ? this.dueDateSetOk() : this.dueDateSetError("Is not a valid date.");
        if(isDateOk){this.dueDateSetOk();}
        return isDateOk;
    }

    /**
     * Checks the validity after input or lost focus of the provided date value.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    checkTheDateValue(){
        const dateCleanValue = (this.dueDateValue ?? "").trim();
        if (dateCleanValue.length < 10) {
            this.dueDateSetError("Is not a valid date.");
            return false;
        }
        else if((dateCleanValue.length == 10 && !this.checkIsCorrectDate(dateCleanValue)) || dateCleanValue.length > 10) {
            return false;
        }else{
            this.dueDateSetOk();
            this.dueDate = dateCleanValue;
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
     * @returns {boolean}
     */
    checkIsCorrectDate(valueToCheck) {
        const regexString = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const matchDateWithRegex = valueToCheck.match(regexString);
        if (!matchDateWithRegex) { 
            this.dueDateSetError("Not a valid date format");
            return false; 
        }

        const dateAsParts = this.getDatePartsOfDateValue(matchDateWithRegex);
        const valueDate = new Date(dateAsParts[2], dateAsParts[1], dateAsParts[0]);

        if (valueDate < Date.now()) { 
            this.dueDateSetError("Date cannot be in the past");
            return false; 
        }

        return (this.isTheDateKorrect(valueDate, dateAsParts));

    }

    /**
     * Checks if the provided date is correct.
     * @param {Date} valueDate 
     * @param {Array<number>} dateAsParts 
     * @returns {boolean}
     */
    isTheDateKorrect(valueDate, dateAsParts){
        return (
            valueDate.getFullYear() === dateAsParts[2] &&
            valueDate.getMonth() === dateAsParts[1] &&
            valueDate.getDate() === dateAsParts[0]
        );
    }


    /**
     * Convert date components from regex array to integers.
     * @param {RegExpMatchArray} matchDateWithRegex
     * @returns {number[]} day, month, year as numbers
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
     * @return {void}
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
     * The date is not correct. Display an error message and highlight the date field.
     * @return {void}
     */
    dueDateSetError(errorMessage = "") {
        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", true, errorMessage);
        this.taskComponents.showAndLeaveErrorBorder("due-date-display", true);
        this.result = false;
    }

    /**
     * The date is correct. Display the date field with normal formatting.
     * @return {void}
     */
    dueDateSetOk() {
        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", false);
        this.taskComponents.showAndLeaveErrorBorder("due-date-display", false);
        this.result = true;
    }

}