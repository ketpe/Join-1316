(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
    * Loads all contacts from the database and sorts them.
    * Utilizes the getSortedContact function from db-functions.js.
    */
    taskComponentsPrototype.loadContactsAllFromDB = async function() {
        const fb = new FirebaseDatabase();
        this.contactAllListFromDB = await fb.getFirebaseLogin(() => fb.getSortedContact());
    };

    /**
     * Shows or hides the contact selection input field.
     * @param {string} showOrHide - Determines whether to show or hide the contact list.
     * @return {void}
     */
    taskComponentsPrototype.showAndHideContacts = function(showOrHide = "show") {
        this.setInputAndButtonOnclickFunctionForContacts(showOrHide);
        const inputField = document.getElementById('task-assign-to');
        if (showOrHide == "show") {
            inputField.value = "";
            inputField.focus();
            this.showContactListForSelect();
            this.renderHideIcon('show-hide-icon-contacts');
            this.showOrHideBadgeContainer("hide");
        } else {
            inputField.value = "Select contacts to assign";
            this.hideContactListForSelect();
            this.renderShowIcon('show-hide-icon-contacts');
            this.showOrHideBadgeContainer("show");
            inputField.blur();
        }
    };

    /**
     * Sets the onclick function for the input field and button for showing/hiding contacts.
     * @param {string} showOrHide - Determines whether to show or hide the contact list.
     * @returns {void}
     */
    taskComponentsPrototype.setInputAndButtonOnclickFunctionForContacts = function(showOrHide) {
        const buttonShowOrHide = document.getElementById('show-and-hide-contacts');
        buttonShowOrHide.setAttribute('onclick', (showOrHide == "show" ? `${this.currentInstance}.showAndHideContacts("hide")` : 
            `${this.currentInstance}.showAndHideContacts("show")`));
        const inputField = document.getElementById('task-assign-to');
        inputField.setAttribute('onclick', (showOrHide == "show" ? `${this.currentInstance}.showAndHideContacts("hide")` : 
            `${this.currentInstance}.showAndHideContacts("show")`));
    };

     /**
     * Renders the show icon for the contact selection.
     * @param {string} elementID - The ID of the element to modify.
     * @returns {void}
     */
    taskComponentsPrototype.renderShowIcon = function(elementID) {
        const iconDiv = document.getElementById(elementID);
        if (!iconDiv) { return; }
        iconDiv.classList.remove('icon-hide-list');
        iconDiv.classList.add('icon-show-list');
    };

    /**
     * Renders the hide icon for the contact selection.
     * @param {string} elementID - The ID of the element to modify.
     * @returns {void}
     */
    taskComponentsPrototype.renderHideIcon = function(elementID) {
        const iconDiv = document.getElementById(elementID);
        if (!iconDiv) { return; }
        iconDiv.classList.add('icon-hide-list');
        iconDiv.classList.remove('icon-show-list');
    };

    /**
     * Shows the contact list for selection.
     * If a current contact list is provided, it uses that; otherwise, it uses the full contact list from the database.
     * Additionally, it adjusts the height of the contact list container based on the number of contacts.
     * @param {Array} currentContactList
     * @returns {void}
     */
    taskComponentsPrototype.showContactListForSelect = function(currentContactList = []) {
        const contactListArray = currentContactList.length !== 0 ? currentContactList : this.contactAllListFromDB;
        if (contactListArray == null || contactListArray.length == 0) { return; }
        this.renderContactOptions(contactListArray);
        const contactListContainer = document.getElementById('contact-List-container');
        const contactList = document.getElementById('contact-List-for-task');
        const heightOfOneContact = 56;
        let heightOfContainer = (contactListArray.length <= 5 ? heightOfOneContact * contactListArray.length : heightOfOneContact * 5) + 25;
        contactListContainer.style.height = heightOfContainer + "px";
        contactList.style.height = (heightOfContainer - 27) + "px";
        contactList.style.marginTop = "28px";
        this.isContactListOpen = true;
        contactListContainer.classList.add("any-list-scroll");
    };

    /**
     * Hides the contact list dropdown for task selection.
     *
     * This function collapses the contact list container and the contact list itself by setting their heights to zero
     * using `requestAnimationFrame` for smooth UI updates. It also clears the contact list's contents and updates
     * the `isContactListOpen` flag to indicate that the contact list is closed.
     *
     * Side Effects:
     * - Modifies the DOM elements with IDs 'contact-List-container' and 'contact-List-for-task'.
     * - Sets the global variable `isContactListOpen` to `false`.
     * @returns {void}
     */
    taskComponentsPrototype.hideContactListForSelect = function() {
        const contactListContainer = document.getElementById('contact-List-container');
        const contactList = document.getElementById('contact-List-for-task');

        requestAnimationFrame(() => {
            contactListContainer.style.height = "0";
            contactList.style.height = "0";
            contactList.style.marginTop = "0";
        });

        contactList.innerHTML = "";
        this.isContactListOpen = false;
    }

    /**
     * Renders the contact options for selection.
     * Using TaskUtils to check if the contact is already assigned to the task.
     * If the contact is the current user, it indicates that in the display.
     * @param {Array} contactList
     * @return {void}
     */
    taskComponentsPrototype.renderContactOptions = function(contactList) {
        let contactSelectElement = document.getElementById('contact-List-for-task');
        contactSelectElement.innerHTML = "";

        for (let i = 0; i < contactList.length; i++) {
            const isCurrentUser = this.currentUser && (this.currentUser === contactList[i]['id']);
            const currentContactAssigned = this.addTaskUtils.findContactInAssignList(contactList[i], this.currentContactAssignList);
            contactSelectElement.innerHTML += getContactListElement(contactList[i], currentContactAssigned, false, this.currentInstance, isCurrentUser);
        }
    };

    /**
     * Handles the selection of a contact button in the list.
     * Uses TaskUtils to check if the contact is available and toggles its selection state.
     * @param {HTMLElement} currentContactBtn - The button element representing the selected contact.
     * @returns {void}
     */
    taskComponentsPrototype.contactButtonOnListSelect = function(currentContactBtn) {

        const contactID = currentContactBtn.getAttribute('id');
        if (!this.addTaskUtils.checkIfContactAvailable(contactID, this.contactAllListFromDB)) { return; }

        currentContactBtn.getAttribute('data-active') == "true" ?
            this.checkOutContact(currentContactBtn, contactID) : this.checkInContact(currentContactBtn, contactID);

    };

    /**
     * Adds the selected contact to the task and updates the UI accordingly.
     * Uses TaskUtils to manage the contact assignment list.
     * Changes the styling of the selected contact to indicate its selection.
     * @param {HTMLElement} currentContact
     * @param {string} contactID
     * @returns {void}
     */
    taskComponentsPrototype.checkInContact = function(currentContact, contactID) {
        this.currentContactAssignList = this.addTaskUtils.contactAddToTask(contactID, this.contactAllListFromDB, this.currentContactAssignList);
        currentContact.classList.add('contact-selected');
        const elementName = currentContact.querySelector(`.contact-profil-container p`);
        elementName.classList.add('white');
        const elementCheck = currentContact.querySelector(`.contact-check-icon`);
        elementCheck.classList.remove('contact-unchecked');
        elementCheck.classList.add('contact-checked');
        currentContact.setAttribute('data-active', 'true');
    };

    /**
     * Removes the selected contact from the task and updates the UI accordingly.
     * Uses TaskUtils to manage the contact assignment list.
     * Changes the styling of the selected contact to indicate its removal.
     * @param {HTMLElement} currentContact
     * @param {string} contactID
     * @return {void}
     */
    taskComponentsPrototype.checkOutContact = function(currentContact, contactID) {
        this.currentContactAssignList = this.addTaskUtils.contactRemoveFromTask(contactID, this.currentContactAssignList);
        currentContact.classList.remove('contact-selected');
        const elementName = currentContact.querySelector(`.contact-profil-container p`);
        elementName.classList.remove('white');
        const elementCheck = currentContact.querySelector(`.contact-check-icon`);
        elementCheck.classList.add('contact-unchecked');
        elementCheck.classList.remove('contact-checked');
        currentContact.setAttribute('data-active', 'false');
    };

    /**
     * Filters the contact list based on the input value.
     * Uses TaskUtils to filter contacts from the full contact list.
     * @param {string} inputValue
     * @returns {void}
     */
    taskComponentsPrototype.filterContactFromInputValue = function(inputValue) {
        this.showContactListForSelect(this.addTaskUtils.filterContacts(inputValue, this.contactAllListFromDB));
    };

    /**
     * Shows or hides the badge container for assigned contacts.
     * @param {string} showOrHide
     * @returns {void}
     */
    taskComponentsPrototype.showOrHideBadgeContainer = function(showOrHide = "") {
        if (showOrHide.length == 0) { return; }
        let container = document.getElementById('contact-assigned-badge');
        if (showOrHide == "show") {
            container.classList.remove('d-none');
            this.renderAsignedProfilBadge();
        } else {
            container.classList.add('d-none');
            container.innerHTML = "";
        }
    };

    /**
     * Renders the assigned profile badges for the selected contacts.
     * If no contacts are assigned, the function returns early.
     * @returns {void}
     */
    taskComponentsPrototype.renderAsignedProfilBadge = function() {
        if (this.currentContactAssignList.length == 0) {return;}
        let badgeContainer = document.getElementById('contact-assigned-badge');
        badgeContainer.innerHTML = "";
        const sortedContacts = this.getSortedContact(this.currentContactAssignList);
        for (let i = 0; i < sortedContacts.length; i++) {
            if (i == 5) {
                const invisibleContacts = sortedContacts.length - i;
                badgeContainer.innerHTML += getBadgeForContactOverflow(invisibleContacts);
                break;
            }
            badgeContainer.innerHTML += getAssignedContactBadge(sortedContacts[i]);
        }
    };

    /**
     * Sorts an array of contacts by name before rendering badges.
     * @param {Array} contactArray 
     * @returns {Array} Sorted array of contacts.
     */
    taskComponentsPrototype.getSortedContact = function(contactArray) {
        return contactArray.sort((a, b) => a.firstname.localeCompare(b.firstname));
    }

})();