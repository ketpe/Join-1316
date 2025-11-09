/**
 * @description Validation methods for task components.
 * This mixin provides validation functionalities for task components,
 * including title validation, due date validation, and required field checks.
 * @mixin taskComponents.validation
 * @see TaskComponents
 */

(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * @description Adds the task title on input change.
     * Removes the error message when the user starts typing.
     * @function addTaskTitleOnInput
     * @memberof taskComponents.validation
     * @returns {void}
     */
    taskComponentsPrototype.addTaskTitleOnInput = function() {
        this.showAndLeaveErrorMessage("a-t-title-required", false);  
    };

    /**
     * @description Sets the focus state for the task title input field.
     * @function addTaskTitleOnFocusFunction
     * @memberof taskComponents.validation
     * @returns {void}
     */
    taskComponentsPrototype.addTaskTitleOnFocusFunction = function() {
        this.addTaskTitleOnFocus = true;
    }

    /**
    * @description Validates the task title.
    * If the title is longer than 3 characters, it sets the currentTitle property.
    * Otherwise, it shows an error message and border.
    * @function taskTitleValidation
    * @memberof taskComponents.validation
    * @param {string} titleValue - The value of the task title.
    * @return {void}
    */
    taskComponentsPrototype.taskTitleValidation = function(titleValue = "") {
        if(!this.addTaskTitleOnFocus) {return;}
        const cleanTitleValue = (titleValue ?? "").trim();

        if (cleanTitleValue.length > 3) {
            this.showAndLeaveErrorMessage("a-t-title-required", false);
            this.showAndLeaveErrorBorder("task-title", false);
            this.currentTitle = cleanTitleValue;
        } else if(cleanTitleValue.length < 4) {
            this.showAndLeaveErrorMessage("a-t-title-required", true, "Title must be at least 4 characters long");
            this.showAndLeaveErrorBorder("task-title", true);
            this.currentTitle = "";
        }else{
            this.showAndLeaveErrorMessage("a-t-title-required", true, "This field is required");
            this.showAndLeaveErrorBorder("task-title", true);
            this.currentTitle = "";
        }

    };

    /**
    * @description Validates the due date field.
    * Updates the currentDueDate and currentDueDateInputValue properties based on validation.
    * @function dateFieldOnChange
    * @memberof taskComponents.validation
    * @return {void}
    */
    taskComponentsPrototype.dateFieldValidation = function() {
        let dateField = document.getElementById('due-date-display');
        if (!dateField) { return; }
        const dueDateCheck = new DueDateCheck(dateField.value, this.currentDueDate, this.currentDueDateInputValue, this);
        const [result, dueDate] = dueDateCheck.startDueDateValidation();
        this.currentDueDate = result ? dueDate : "";
        this.currentDueDateInputValue = dateField.value;
    };


    /**
     * @description Sets the focus state for the due date input field.
     * @function addTaskDueDateOnFocusFunction
     * @memberof taskComponents.validation
     * @returns {void}
     */
    taskComponentsPrototype.addTaskDueDateOnFocusFunction = function() {
        this.addTaskDueDateOnFocus = true;
    }

    /**
     * @description Handles the click event on the date icon to show the date picker.
     * @function onDateIconClick
     * @memberof taskComponents.validation
     * @return {void}
     */
    taskComponentsPrototype.onDateIconClick = function() {
        let datePicker = document.getElementById('due-date-hidden');
        datePicker.showPicker();
    };

    /**
     * @description Handles the change event on the date picker.
     * @function datePickerSelectionChange
     * @memberof taskComponents.validation
     * @param {Event} e - The change event object.
     * @return {void}
     */
    taskComponentsPrototype.datePickerSelectionChange = function(e) {
        let newDateArr = String(e.target.value).split('-');
        let newDateString = `${newDateArr[2]}/${newDateArr[1]}/${newDateArr[0]}`;
        document.getElementById('due-date-display').value = newDateString;
        this.dateFieldOnChange();
    };

    /**
    * @description Shows and leaves an error message for the specified target.
    * @function showAndLeaveErrorMessage
    * @memberof taskComponents.validation
    * @param {string} messageTarget - The ID of the message target element.
    * @param {boolean} visibility - Indicates whether to show or hide the error message.
    * @returns {void}
    */
    taskComponentsPrototype.showAndLeaveErrorMessage = function(messageTarget, visibility = true, messageText = "") {
        let errorField = document.getElementById(messageTarget);
        if (errorField == null) { return; }
        if (visibility) {
            errorField.classList.remove("error-text-hidden");
            errorField.classList.add('error-text-show');
            errorField.textContent = messageText;
        } else {
            errorField.classList.add("error-text-hidden");
            errorField.classList.remove('error-text-show');
        }
    };

    /**
     * @description Shows and leaves an error border for the specified input field.
     * @function showAndLeaveErrorBorder
     * @memberof taskComponents.validation
     * @param {string} inputTarget - The ID of the input field.
     * @param {boolean} visibility - Indicates whether to show or hide the error border.
     * @returns {void}
     */
    taskComponentsPrototype.showAndLeaveErrorBorder = function(inputTarget, visibility = true) {
        let inputField = document.getElementById(inputTarget);
        if (inputField == null) { return; }
        if (visibility) {
            inputField.classList.add('input-has-error');
        } else {
            inputField.classList.remove('input-has-error');
        }
    };

    /**
    * @description Handles the mouse click event on the Add Task form to validate required fields.
    * @function addTaskSubmitOnMouse
    * @memberof taskComponents.validation
    * @param {HTMLElement} button - The button element that was clicked.
    * @return {void}
    */
    taskComponentsPrototype.addTaskSubmitOnMouse = function(button) {
        document.getElementById('task-title').blur();
        document.getElementById('due-date-display').blur();
        this.addTaskCheckRequiredField(button);
    };

    /**
    * @description Checks if all required fields are filled and enables/disables the create button accordingly.
    * @function addTaskCheckRequiredField
    * @memberof taskComponents.validation
    * @param {HTMLElement} createButton - The create button element.
    * @return {void}
    */
    taskComponentsPrototype.addTaskCheckRequiredField = function(createButton) {

        if (!createButton) { return; }

        const hasCategory = this.currentCategory && typeof this.currentCategory === 'object' && 'title' in this.currentCategory;
        createButton.disabled = !(
            this.currentDueDate.length > 0 &&
            this.currentTitle.length > 0 &&
            this.currentPriority.length > 0 &&
            hasCategory);

        createButton.disabled ? createButton.setAttribute('aria-disabled', 'true') : createButton.removeAttribute('aria-disabled');

    }   

     /**
     * @description Checks the value of the category input field for validity.
     * If the input field is empty or has the default placeholder value, it shows an error message and border.
     * If a valid category is selected, it hides the error message and border.
     * @function checkCategoryInputValue
     * @memberof taskComponents.validation
     * @returns {void}
     */
    taskComponentsPrototype.checkCategoryInputValue = function() {
        let categoryInput = document.getElementById('task-category');
        if (!categoryInput) { return; }
        if (categoryInput.value == "Select task category") {
            this.showAndLeaveErrorMessage('a-t-category-required', true);
            this.showAndLeaveErrorBorder('task-category', true);
        } else {
            this.showAndLeaveErrorMessage('a-t-category-required', false);
            this.showAndLeaveErrorBorder('task-category', false);
        }

    };

})();