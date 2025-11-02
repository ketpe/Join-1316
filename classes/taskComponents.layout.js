(function() {
    const taskComponentsPrototype = TaskComponents.prototype;

    /**
     * Checks if there is enough space in the add task dialog for the current content.
     * If there isn't enough space, it enables scrolling in the right container.
     * @returns void
     */
    taskComponentsPrototype.checkAvailableSpaceInAddTaskDialog = function(){
        const [addTaskDialog, addTaskRightContainer, addTaskHeader, addTaskFooter, seperator] = this.getElementsForCheckSpaceInAddTaskDialog();

        if(!addTaskRightContainer || !addTaskDialog || !addTaskHeader || !addTaskFooter || !seperator){return;}
        const [sum, rightContainerAvalable] = this.calculateHeightForRightContainerInDialog(addTaskDialog, addTaskHeader, addTaskFooter, addTaskRightContainer);

        if(sum > addTaskDialog.offsetHeight){
            addTaskRightContainer.classList.add('a-t-f-i-scroll');
            addTaskRightContainer.style.height = rightContainerAvalable + "px";
            seperator.style.height = rightContainerAvalable + "px";
        } else {
            addTaskRightContainer.classList.remove('a-t-f-i-scroll');
            addTaskRightContainer.style.height = "auto";
            seperator.style.height = 440 + "px";
        }
        
    };

    /**
     * Gets the elements needed to check the space in the add task dialog.
     * @returns {Array} - An array containing the relevant elements.
     */
    taskComponentsPrototype.getElementsForCheckSpaceInAddTaskDialog = function(){
        const addTaskDialog = document.getElementById('add-task-dialog');
        if(!addTaskDialog){ return []; } 
        const addTaskRightContainer = addTaskDialog.querySelector('.a-t-f-i-right');
        const addTaskHeader = addTaskDialog.querySelector('header.add-task-head');
        const addTaskFooter = addTaskDialog.querySelector('.add-task-footer');
        const seperator = addTaskDialog.querySelector('#a-t-middle-container');
        return [addTaskDialog, addTaskRightContainer, addTaskHeader, addTaskFooter, seperator];
    };

    /**
     * Calculates the total height needed for the right container in the add task dialog.
     * @param {HTMLElement} dialog 
     * @param {HTMLElement} header 
     * @param {HTMLElement} footer 
     * @param {HTMLElement} rightContainer 
     * @returns {Array} - An array containing the total height and the available height for the right container.
     */
    taskComponentsPrototype.calculateHeightForRightContainerInDialog = function(dialog, header, footer, rightContainer){
        const sum = rightContainer.scrollHeight + header.offsetHeight + footer.offsetHeight + 200;
        const rightContainerAvalable = dialog.offsetHeight - header.offsetHeight - footer.offsetHeight - 200;
        return [sum, rightContainerAvalable];
    };

    /**
     * Checks if there is enough space in the add task dialog for the current content.
     * If there isn't enough space, it enables scrolling in the right container.
     * @returns void
     */
    taskComponentsPrototype.checkAvailableSpaceInAddTask = function(){
        const [siteHeader, addTaskHeader, addTaskFooter, seperator, rightContainer] = this.getElementsForCheckSpaceInAddTask();
        if(!siteHeader || !addTaskHeader || !addTaskFooter || !seperator || !rightContainer){return;}
        const [sum, rightContainerAvalable] = this.calculateHeightForRightContainer(siteHeader, addTaskHeader, addTaskFooter, rightContainer);

        if(sum > window.innerHeight){
            rightContainer.classList.add('a-t-f-i-scroll');
            rightContainer.style.height = rightContainerAvalable  <= 400 ? "400px" : rightContainerAvalable + "px";
        }else{
            rightContainer.classList.remove('a-t-f-i-scroll');
            rightContainer.style.height = 440 + "px";
            seperator.style.height = 440 + "px";
        }

    };

    /**
     * Gets the elements needed to check the space in the add task dialog.
     * @returns {Array} - An array containing the relevant elements.
     */
    taskComponentsPrototype.getElementsForCheckSpaceInAddTask = function(){
        const siteHeader = document.getElementById('header');
        const addTaskHeader = document.querySelector('header.add-task-head');
        const addTaskFooter = document.querySelector('.add-task-footer');
        const seperator = document.querySelector('#a-t-middle-container');
        const rightContainer = document.querySelector('.a-t-f-i-right');
        return [siteHeader, addTaskHeader, addTaskFooter, seperator, rightContainer];
    };


    /**
     * Calculates the total height needed for the right container in the add task dialog.
     * @param {HTMLElement} dialog 
     * @param {HTMLElement} header 
     * @param {HTMLElement} footer 
     * @param {HTMLElement} rightContainer 
     * @returns {Array} - An array containing the total height and the available height for the right container.
     */
    taskComponentsPrototype.calculateHeightForRightContainerInDialog = function(dialog, header, footer, rightContainer){
        const sum = rightContainer.scrollHeight + header.offsetHeight + footer.offsetHeight + 200;
        const rightContainerAvalable = dialog.offsetHeight - header.offsetHeight - footer.offsetHeight - 200;
        return [sum, rightContainerAvalable];
    };
   

})();