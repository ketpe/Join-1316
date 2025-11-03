/**
 * @fileoverview
 * @namespace boardSearch
 * @description Functions for searching tasks on the Kanban board. functions for searching tasks on the Kanban board.
 */

/**
 * @function searchTaskInBoard
 * @memberof boardSearch
 * @description Searches for tasks on the board based on the input in the search bar.
 * It filters tasks by title and description, and toggles their visibility accordingly. It also manages the display of a "no search results" hint.
 * @return {void}
 */
function searchTaskInBoard() {
    const { searchInput, taskTitles, taskDescriptions } = getRefsForSearch();
    let visibleCount = 0;
    taskTitles.forEach((titleP, i) => {
        const descP = taskDescriptions[i];
        const match = [titleP, descP].some(
            el => el && el.textContent.toLowerCase().includes(searchInput)
        );
        const card = titleP.parentElement.parentElement.parentElement;
        card.classList.toggle('visually-hidden', !match && searchInput);
        if (!card.classList.contains('visually-hidden')) visibleCount++;
    });
    toggleNoSearchResultHint(visibleCount, searchInput);
}

/**
 * @function toggleNoSearchResultHint
 * @memberof boardSearch
 * @description Toggles the visibility of the "no search results" hint based on the search results.
 * @param {number} visibleCount - The number of visible task cards.
 * @param {string} searchInput - The current search input.
 * @return {void}
 */
function toggleNoSearchResultHint(visibleCount, searchInput) {
    const noResultHint = document.getElementById('empty-Search-Result-info');
    if (noResultHint) {
        if (visibleCount === 0 && searchInput) {
            noResultHint.style.display = 'block';
        } else {
            noResultHint.style.display = 'none';
        }
    }
}

/**
 * @function emptySearchBar
 * @memberof boardSearch
 * @description Empties the search bar and shows all task titles.
 * @param {string} searchInput - The current search input.
 * @param {NodeList} taskTitles - The list of task title elements.
 * @returns {void}
 */
function emptySearchBar(searchInput, taskTitles) {
    if (!searchInput) {
        taskTitles.forEach(p => {
            p.parentElement.parentElement.parentElement.classList.remove('visually-hidden');
        });
        return;
    }
}

/**
 * @function getRefsForSearch
 * @memberof boardSearch
 * @description Gets references for the search functionality.
 * @returns {Object} - An object containing the search input and task elements.
 */
function getRefsForSearch() {
    let searchInput = document.getElementById('board-searchbar').value.toLowerCase();
    let taskTitles = document.querySelectorAll('.board-task-title p');
    let taskDescriptions = document.querySelectorAll('.board-task-description p');
    return { searchInput, taskTitles, taskDescriptions };
}