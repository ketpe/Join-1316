/**
 * @description Class for validating and managing due date input for tasks.
 * Ensures the due date is in the correct format (DD/MM/YYYY) and not in the past.
 * Provides feedback to the user through UI components.
 * @class DueDateCheck
 * @namespace dueDateCheck
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
     * @description Creates an instance of the DueDateCheck class.
     * @memberof dueDateCheck
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
     * @description Checks the validity on input of the provided date value.
     * @function checkTheDateValueOnInput
     * @memberof dueDateCheck
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
     * @description Checks the validity after input or lost focus of the provided date value.
     * @function checkTheDateAfterInput
     * @memberof dueDateCheck
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    checkTheDateAfterInput(){
        const isDateOk = this.checkTheDateValue();
        if(isDateOk){this.dueDateSetOk();}
        return isDateOk;
    }

    /**
     * @description Checks the validity after input or lost focus of the provided date value.
     * @function checkTheDateValue
     * @memberof dueDateCheck
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
     * @description Check whether the date value conforms to the format. 
     * Split the string into its individual date components. 
     * Create a date from these numbers; this date cannot be in the past. 
     * Finally, the date components from the created date are compared with the components of the passed date. 
     * If they are equal, it returns true; otherwise, it returns false.
     * @function checkIsCorrectDate
     * @memberof dueDateCheck
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

        if (valueDate < this.getDateNow) { 
            this.dueDateSetError("Date cannot be in the past");
            return false; 
        }

        return (this.isTheDateKorrect(valueDate, dateAsParts));

    }

    /**
     * @description Gets today's date with time set to 00:00:00.000.
     * @getter getDateNow
     * @memberof dueDateCheck
     * @returns {Date} Today's date.
     */
    get getDateNow(){
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
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
     * @description Convert date components from regex array to integers.
     * @function getDatePartsOfDateValue
     * @memberof dueDateCheck
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
     * @description Check the character set of the date value string.
     * This function checks if the date value string contains only valid characters (digits and slashes).
     * @function checkDateCharSet
     * @memberof dueDateCheck
     * @param {string} dateValueString 
     * @returns {void}
     */
    checkDateCharSet(dateValueString) {
        if (this.currentInputValue.length >= dateValueString.length) { return; }
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
     * @description Sets the constructed date into the display field and updates the dueDate property.
     * @function setConstructedDateIntoTheField
     * @memberof dueDateCheck
     * @param {string} cDate - The constructed date string to set.
     * @return {void}
     */
    setConstructedDateIntoTheField(cDate){
        document.getElementById('due-date-display').value = cDate;
        this.dueDate = cDate;
    }
    
    /**
     * @description Highlight the date field so the user can see that their entry was invalid.
     * The date is not correct. Display an error message and highlight the date field.
     * @function dueDateSetError
     * @memberof dueDateCheck
     * @param {string} errorMessage - The error message to display.
     * @return {void}
     */
    dueDateSetError(errorMessage = "") {
        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", true, errorMessage);
        this.taskComponents.showAndLeaveErrorBorder("due-date-display", true);
        this.result = false;
    }

    /**
     * @description The date is correct. Display the date field with normal formatting.
     * And clear any error messages.
     * @function dueDateSetOk
     * @memberof dueDateCheck
     * @return {void}
     */
    dueDateSetOk() {
        this.taskComponents.showAndLeaveErrorMessage("a-t-due-date-required", false);
        this.taskComponents.showAndLeaveErrorBorder("due-date-display", false);
        this.result = true;
    }

}