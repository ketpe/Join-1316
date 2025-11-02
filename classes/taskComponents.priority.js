(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * Handles the selection of a priority button in the Add Task form.
     * @param {HTMLElement} button - The priority button element.
     * @returns {void}
     */
    taskComponentsPrototype.addTaskPrioritySelect = function(button) {
        if (!button) { return; }
        const buttonName = button.getAttribute('name');
        const isActiv = button.getAttribute('data-selected') == "true";
        this.currentPriority == buttonName && isActiv ? this.allPriortyButtonsReset() : this.setNewPriority(buttonName);
    };

     /**
     * Resets all priority buttons to their default state (not selected).
     * @returns {void}
     */
    taskComponentsPrototype.allPriortyButtonsReset = function() {
        this.currentPriority = "";
        const btnContainer = document.getElementById('task-priority-button');
        if (!btnContainer) { return; }
        const buttons = btnContainer.querySelectorAll('.btn');

        buttons.forEach((b) => {
            b.setAttribute('data-selected', 'false');
            this.setButtonStyleNotActiv(b);
        });
    };

    /**
     * Sets a new priority for the task.
     * @param {string} priority - The name of the priority to set.
     * @return {void}
     */
    taskComponentsPrototype.setNewPriority = function(priority) {
        const btnContainer = document.getElementById('task-priority-button');
        const buttons = btnContainer.querySelectorAll('.btn');
        buttons.forEach((b) => {
            if (b.getAttribute('name') == priority) {
                b.setAttribute('data-selected', 'true');
                this.setButtonStyleActiv(b);
            } else {
                b.setAttribute('data-selected', 'false');
                this.setButtonStyleNotActiv(b);
            }
        });
        this.currentPriority = priority;
    };

    /**
     * Sets the button to the active state (selected).
     * @param {HTMLElement} button - The button element to activate.
     * @returns {void}
     */
    taskComponentsPrototype.setButtonStyleActiv = function(button) {
        if (!button) { return; }
        button.classList.add(`prio-${button.getAttribute('data-name')}-selected`);
        this.togglePrioButtonTextColor(button, "white");
    };

    /**
     * Sets the button to the inactive state (not selected).
     * @param {HTMLElement} button - The button element to deactivate.
     * @returns {void}
     */
    taskComponentsPrototype.setButtonStyleNotActiv = function(button) {
        if (!button) { return; }
        button.classList.remove(`prio-${button.getAttribute('data-name')}-selected`);
        this.togglePrioButtonTextColor(button, "black");
    };

    /**
     * Toggles the text color of the priority button.
     * @param {HTMLElement} button - The button element to modify.
     * @param {string} whiteOrBlack - The color to set the text to ("white" or "black").
     * @returns {void}
     */
    taskComponentsPrototype.togglePrioButtonTextColor = function(button, whiteOrBlack) {
        if (!button) { return; }
        let btnText = button.querySelector('span');
        if (!btnText) { return; }
        whiteOrBlack == "white" ? btnText.classList.add('prio-selected') : btnText.classList.remove('prio-selected');
    };

})();