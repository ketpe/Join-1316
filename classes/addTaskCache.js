/**
 * @class AddTaskCache
 * @description This class provides static methods to get, set, capture, and apply cached data for the Add Task view.
 * The cached data includes form inputs, selected category, assigned contacts, and subtasks.
 * The cache helps preserve user input when navigating away from and back to the Add Task view.
 */


class AddTaskCache {
    static _addTaskCache = {
        formData: { title: "", description: "", dueDate: "", priority: "Medium" },
        category: null,
        assignedContacts: [],
        subTasks: []
    };

    /**
     * Gets the cached data for the add task view.
     * @returns {Object} The cached data for the add task view.
     */
    static getAddTaskCache() {
        return this._addTaskCache;
    }

    /**
     * Sets the cached data for the add task view.
     * @param {Object} patch - The data to update in the cache.
     */
    static setAddTaskCache(patch) {
        this._addTaskCache = { ...this._addTaskCache, ...patch };
    }

    /**
     * Captures the current data from the add task view and updates the cache.
     * @returns {void}
     */
    static captureCurrentAddTaskDataFromView() {

        if (!this.checkBodyIsNotEmpty()) { return; }
        const { titleElement, descriptionElement, dueDateElement } = this.captureInputFields();
        const { category, assignedContacts, subTasks } = this.getTaskComponentVariablen;

        this.setAddTaskCache({
            formData: {
                title: (titleElement?.value ?? "").trim(),
                description: (descriptionElement?.value ?? "").trim(),
                dueDate: (dueDateElement?.value ?? "").trim(),
                priority: this.getPrioDataForCache
            },
            category,
            assignedContacts: Array.isArray(assignedContacts) ? [...assignedContacts] : [],
            subTasks: Array.isArray(subTasks) ? [...subTasks] : []
        });
    }

    /**
     * Gets the current task component variables, falling back to cached values if necessary.
     * @returns {Object} An object containing the current category, assigned contacts, and subtasks.
     */
    static get getTaskComponentVariablen() {
        const components = this.getTaskComponent;
        const category = components?.currentCategory?.id ? components.currentCategory : this._addTaskCache.category;
        const assignedContacts = components?.currentContactAssignList || this._addTaskCache.assignedContacts;
        const subTasks = components?.currentSubTasks || this._addTaskCache.subTasks;
        return { category, assignedContacts, subTasks };
    }

    /**
     * Gets the selected priority from the view or falls back to the cached priority.
     * @returns {string} The selected priority or the cached priority.
     */
    static get getPrioDataForCache() {
        const prioButtonsContainer = document.getElementById('task-priority-button');
        const selectedPrioButton = prioButtonsContainer?.querySelector('.btn[data-selected="true"]');
        return selectedPrioButton?.getAttribute('name') || this._addTaskCache.formData.priority || "Medium";
    }

    /**
     * Gets the current task component instance from the global window object.
     * @returns {Object} The current task component instance.
     */
    static get getTaskComponent() {
        return window.addTasktaskComponents || window.addTaskDialogTaskComponents;
    }

    /**
     * Checks if the document body is not empty.
     * @returns {boolean} True if the document body has children, false otherwise.
     */
    static checkBodyIsNotEmpty() {
        return document.body && document.body.children.length > 0 ? true : false;
    }

    /**
     * Applies the cached add task data to the view components.
     * @param {Object} components - The components to apply the data to.
     * @returns {void}
     */
    static applyAddTaskDataToView(components) {
        if (!components) { return; }
        const { formData, category, assignedContacts, subTasks } = this._addTaskCache;

        components.currentTitle = formData.title;
        components.currentDueDate = formData.dueDate || "";
        components.currentPriority = formData.priority || "Medium";
        components.currentCategory = category || {};
        components.currentContactAssignList = Array.isArray(assignedContacts) ? [...assignedContacts] : [];
        components.currentSubTasks = Array.isArray(subTasks) ? [...subTasks] : [];

        this.applyFormDataIntoInputFields(formData);
        components.setNewPriority(formData.priority || "Medium");
        this.applyCategoryToView(category, components);
        components.showOrHideBadgeContainer('show');
        components.renderSubtasks();
        const btn = document.getElementById('createTaskButton');
        components.addTaskCheckRequiredField(btn);

    }

    /**
     * Applies form data into the input fields of the add task view.
     * @param {Object} formData - The form data to apply.
     * @returns {void}
     */
    static applyFormDataIntoInputFields(formData) {
        const { titleElement, descriptionElement, dueDateElement } = this.captureInputFields();
        if (titleElement) { titleElement.value = formData.title || ""; }
        if (descriptionElement) { descriptionElement.value = formData.description || ""; }
        if (dueDateElement) { dueDateElement.value = formData.dueDate || ""; }
    }

    /**
     * Applies the selected category to the view components.
     * @param {Object} category - The category to apply.
     * @param {Object} components - The components to apply the category to.
     * @returns {void}
     */
    static applyCategoryToView(category, components) {
        if (category?.title) {
            components.setCategoryInputfieldValue(category.title);
            components.showAndLeaveErrorMessage('a-t-category-required', false);
            components.showAndLeaveErrorBorder('task-category', false);
        } else {
            components.setCategoryInputfieldValue('Select task category');
        }
    }

    /**
     * Captures the input fields from the add task view.
     * @returns {Object} An object containing the title, description, and due date elements.
     */
    static captureInputFields() {
        const titleElement = document.getElementById('task-title');
        const descriptionElement = document.getElementById('task-description');
        const dueDateElement = document.getElementById('due-date-display');

        return { titleElement, descriptionElement, dueDateElement };
    }

    constructor() { }
}