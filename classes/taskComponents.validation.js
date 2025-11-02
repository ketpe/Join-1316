(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * Adds the task title on input change.
     * @returns {void}
     */
    taskComponentsPrototype.addTaskTitleOnInput = function() {
        let titleValue = document.getElementById('task-title');
        if (!titleValue.value) {
            this.showAndLeaveErrorMessage("a-t-title-required", true);
            this.showAndLeaveErrorBorder("task-title", true);
        } else {
            this.taskTitleValidation(titleValue.value);
        }
    };

    /**
    * Validates the task title.
    * @param {string} titleValue - The value of the task title.
    * @return {void}
    */
    taskComponentsPrototype.taskTitleValidation = function(titleValue = "") {
        const cleanTitleValue = (titleValue ?? "").trim();

        if (cleanTitleValue.length > 3) {
            this.showAndLeaveErrorMessage("a-t-title-required", false);
            this.showAndLeaveErrorBorder("task-title", false);
            this.currentTitle = cleanTitleValue;
        } else {
            this.showAndLeaveErrorMessage("a-t-title-required", true);
            this.showAndLeaveErrorBorder("task-title", true);
            this.currentTitle = "";
        }

    };

    /**
    * Validates the due date field.
    * @return {void}
    */
    taskComponentsPrototype.dateFieldOnChange = function() {
        let dateField = document.getElementById('due-date-display');
        if (!dateField) { return; }
        const dueDateCheck = new DueDateCheck(dateField.value, this.currentDueDate, this.currentDueDateInputValue, this);
        const [result, dueDate] = dueDateCheck.startDueDateValidation();
        this.currentDueDate = result ? dueDate : "";
        this.currentDueDateInputValue = dateField.value;
    };

    /**
     * Handles the click event on the date icon to show the date picker.
     * @return {void}
     */
    taskComponentsPrototype.onDateIconClick = function() {
        let datePicker = document.getElementById('due-date-hidden');
        datePicker.showPicker();
    };

    /**
     * Handles the change event on the date picker.
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
    * Shows and leaves an error message for the specified target.
    * @param {string} messageTarget - The ID of the message target element.
    * @param {boolean} visibility - Indicates whether to show or hide the error message.
    * @returns {void}
    */
    taskComponentsPrototype.showAndLeaveErrorMessage = function(messageTarget, visibility = true) {
        let errorField = document.getElementById(messageTarget);
        if (errorField == null) { return; }
        if (visibility) {
            errorField.classList.remove("error-text-hidden");
            errorField.classList.add('error-text-show');
        } else {
            errorField.classList.add("error-text-hidden");
            errorField.classList.remove('error-text-show');
        }
    };

    /**
     * Shows and leaves an error border for the specified input field.
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
    * Handles the mouse click event on the Add Task form to validate required fields.
    * @param {HTMLElement} button - The button element that was clicked.
    * @return {void}
    */
    taskComponentsPrototype.addTaskSubmitOnMouse = function(button) {
        document.getElementById('task-title').blur();
        document.getElementById('due-date-display').blur();
        this.addTaskCheckRequiredField(button);
    };

    /**
    * Checks if all required fields are filled and enables/disables the create button accordingly.
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
     * Checks the value of the category input field for validity.
     * If the input field is empty or has the default placeholder value, it shows an error message and border.
     * If a valid category is selected, it hides the error message and border.
     * @returns void
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