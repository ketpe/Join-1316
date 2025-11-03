/**
 * @description Priority related methods for TaskComponents class.
 * This mixin provides functionalities to manage task priority selection,
 * including handling user interactions with priority buttons and updating
 * the visual state of the buttons based on the selected priority.
 * @mixin taskComponents.priority
 * @see TaskComponents
 */


(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * @description Handles the selection of a priority button in the Add Task form.
     * When a button is clicked, it checks if the clicked button is already active.
     * If it is active, it resets all priority buttons. If it is not active,
     * it sets the new priority based on the clicked button.
     * @function addTaskPrioritySelect
     * @memberof taskComponents.priority
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
     * @description Resets all priority buttons to their default state (not selected).
     * @function allPriortyButtonsReset
     * @memberof taskComponents.priority
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
     * @description Sets a new priority for the task.
     * @function setNewPriority
     * @memberof taskComponents.priority
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
     * @description Sets the button to the active state (selected).
     * @function setButtonStyleActiv
     * @memberof taskComponents.priority
     * @param {HTMLElement} button - The button element to activate.
     * @returns {void}
     */
    taskComponentsPrototype.setButtonStyleActiv = function(button) {
        if (!button) { return; }
        button.classList.add(`prio-${button.getAttribute('data-name')}-selected`);
        this.togglePrioButtonTextColor(button, "white");
    };

    /**
     * @description Sets the button to the inactive state (not selected).
     * @function setButtonStyleNotActiv
     * @memberof taskComponents.priority
     * @param {HTMLElement} button - The button element to deactivate.
     * @returns {void}
     */
    taskComponentsPrototype.setButtonStyleNotActiv = function(button) {
        if (!button) { return; }
        button.classList.remove(`prio-${button.getAttribute('data-name')}-selected`);
        this.togglePrioButtonTextColor(button, "black");
    };

    /**
     * @description Toggles the text color of the priority button.
     * @function togglePrioButtonTextColor
     * @memberof taskComponents.priority
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