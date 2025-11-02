(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
    * Loads categories from the database.
    * Utilizes the getAllData function from db-functions.js.
    * @returns {Promise<void>}
    */
    taskComponentsPrototype.loadCategoriesFromDB = async function() {
        const fb = new FirebaseDatabase();
        this.categories = await fb.getFirebaseLogin(() => fb.getAllData("categories"));
    };

    /**
     * Shows or hides the category list for selection.
     * @param {string} showOrHide
     * @return {void}
     */
    taskComponentsPrototype.showAndHideCategories = function(showOrHide = "show") {
        if (showOrHide == "show") {
            this.showCategoryListForSelect();
            this.setCategoryShowOrHideButton(showOrHide);
            this.renderHideIcon('show-hide-icon-category');
        } else {
            this.hideCategoryListForSelect();
            this.checkCategoryInputValue();
        }
    };

    /**
     * Shows the category list for selection.
     * If no categories are available, the function returns early.
     * Renders the category options and adjusts the height of the category list container based on the number of categories.
     * @returns {void}
     */
    taskComponentsPrototype.showCategoryListForSelect = function() {
        if (this.categories == null || this.categories.length == 0) { return; }
        this.renderCategoryOptions(this.categories);
        const categoryListContainer = document.getElementById('category-list-container');
        const categoryList = document.getElementById('category-list-for-task');
        const heightOfOneCategory = document.getElementById(this.categories[0]['id']).offsetHeight || 54;
        let heightOfContainer = heightOfOneCategory * this.categories.length + 25;
        categoryListContainer.style.height = heightOfContainer + "px";
        categoryList.style.height = (heightOfContainer - 27) + "px";
        categoryList.style.marginTop = "28px";
        categoryListContainer.classList.add("any-list-scroll");
        this.setCategoryInputfieldValue('Select task category');
        this.currentCategory = {};
        this.isCategoryListOpen = true;
    };

    /**
     * Hides the category list for selection.
     * Uses `requestAnimationFrame` to smoothly collapse the category list container and the category list itself by setting their heights to zero.
     * @returns {void}
     */
    taskComponentsPrototype.hideCategoryListForSelect = function() {
        const categoryListContainer = document.getElementById('category-list-container');
        const categoryList = document.getElementById('category-list-for-task');

        requestAnimationFrame(() => {
            categoryListContainer.style.height = "0";
            categoryList.style.height = "0";
        });

        categoryList.innerHTML = "";
        this.setCategoryShowOrHideButton('hide');
        this.renderShowIcon('show-hide-icon-category');
        this.isCategoryListOpen = false;
    };

    /**
     * Renders the category options for selection.
     * If no categories are available, the function returns early.
     * @param {Array} categories
     */
    taskComponentsPrototype.renderCategoryOptions = function(categories) {
        let categorySelectElement = document.getElementById('category-list-for-task');
        categorySelectElement.innerHTML = "";

        for (let i = 0; i < categories.length; i++) {
            categorySelectElement.innerHTML += getCategoryListElement(categories[i], this.currentInstance);
        }
    };

    /**
     * Handles the selection of a category from the list.
     * If no button is provided, an error is shown.
     * If the selected category is not found in the categories array, an error is shown.
     * Sets the current category and updates the input field value.
     * Hides the category list after selection and checks the category input value for validation.
     * Uses TaskUtils to find the index of the selected category in the categories array.
     * @param {HTMLElement} button - The button element representing the selected category.
     * @return {void}
     */
    taskComponentsPrototype.categoryButtonOnListSelect = function(button) {
        if (!button) { showCategoryError(); }
        let indexOfCategory = this.addTaskUtils.getIndexOfObjectOfArray(button.getAttribute('id'), this.categories);
        if (indexOfCategory < 0) { showCategoryError(); }
        this.currentCategory = this.categories[indexOfCategory];
        this.hideCategoryListForSelect();
        this.setCategoryInputfieldValue(this.currentCategory['title']);
        this.checkCategoryInputValue();
    };

    /**
     * Sets the value of the category input field.
     * @param {string} value - The value to set in the category input field.
     * @return {void}
     */
    taskComponentsPrototype.setCategoryInputfieldValue = function(value) {
        document.getElementById('task-category').value = value;
    };

    /**
     * Sets the onclick attribute for the show/hide button.
     * @param {string} showOrHide
     * @return {void}
     */
    taskComponentsPrototype.setCategoryShowOrHideButton = function(showOrHide) {
        const buttonShowOrHide = document.getElementById('show-and-hide-categories');
        buttonShowOrHide.setAttribute('onclick', (showOrHide == "show" ? `${this.currentInstance}.showAndHideCategories("hide")` : `${this.currentInstance}.showAndHideCategories("show")`));
    };

    /**
     * Handles the click event on the category input field.
     * If the category list is open, it blurs the input field, hides the category list, and checks the input value.
     * If the category list is closed, it shows the category list.
     * @param {HTMLElement} inputField - The input field element for the category.
     * @return {void}
     */
    taskComponentsPrototype.onclickCategoryInput = function(inputField) {
        if (this.isCategoryListOpen) {
            inputField.blur();
            this.hideCategoryListForSelect();
            this.checkCategoryInputValue();
        } else {
            this.showAndHideCategories('show');
        }
    };

})();