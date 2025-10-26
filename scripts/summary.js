/**
 * @fileoverview
 * @namespace summary
 * @description summary.js - Handles loading and displaying task summaries.
 * Manages responsive design for mobile and desktop views.
 * Loads HTML components dynamically based on window size.
 * Fetches task data from Firebase and computes summary statistics.
 * Updates the UI with summary information.
 */

let currentView = "";
const minDesktopHeight = 880;
const minDesktopWidth = 840;
const breakPointToDesktopSingle = 1180;
let isStartupSummary = false;

/**
 * @function onLoadSummary
 * @memberof summary
 * Initializes the summary page based on the current window size and URL parameters.
 * @async
 * @returns {Promise<void>}
 */
async function onLoadSummary() {

    getURLParameter();

    const [height, width] = getCurrentWindowSize();
    if (width >= minDesktopWidth) {
        await loadHtmlComponentsForDesktop();
        setNavigationButtonActive('summary', "desktop");

    } else {
        await loadHtmlComponentsForMobile();
        setNavigationButtonActive('summary', "mobile");
    }

}

/**
 * @function onSummaryPageResize
 * @memberof summary
 * Handles window resize events to switch between mobile and desktop views.
 * @async
 * @function onSummaryPageResize
 * @returns {Promise<void>}
 */
async function onSummaryPageResize() {
    const [height, width] = getCurrentWindowSize();
    if ((width <= minDesktopWidth) && currentView != "mobile") {
        await loadHtmlComponentsForMobile();
        removeMobileGreetingAnimation();
        setNavigationButtonActive('summary', "mobile");

    } else if (width >= minDesktopWidth + 1 && currentView != "desktop") {
        await loadHtmlComponentsForDesktop();
        setNavigationButtonActive('summary', "desktop");
    }

    if (currentView === "mobile") {
        setHeightInMobileMode();
        removeMobileGreetingAnimation();
    }

}

/**
 * @function getURLParameter
 * @memberof summary
 * Parses URL parameters to determine if the summary page is being loaded at startup.
 * @function getURLParameter
 * @returns {void}
 */
function getURLParameter() {
    let param = new URLSearchParams(document.location.search);
    let pageParam = param.get('isNotStartup');
    isStartupSummary = (pageParam == null || pageParam.length == 0 || pageParam.startsWith('false')) ? false : true;

    if (pageParam != null && pageParam.length > 0) {
        param.delete('isNotStartup');
        window.history.replaceState({}, document.title, '/summary.html');
    }
}

/**
 * @function loadHtmlComponentsForDesktop   
 * @memberof summary
 * Loads HTML components for the desktop view.
 * @async
 * @function loadHtmlComponentsForDesktop
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForDesktop() {
    currentView = "desktop";
    clearAddTaskHtmlBody();
    await includeHtmlForNode("body", "summaryDesktop.html");

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),
    ]);
    showLoadingAnimation();
    await loadTasksforSummary();
    renderGreetings("greeting","greetingName");
    hideLoadingAnimation();
}

/**
 * @function loadHtmlComponentsForMobile
 * @memberof summary
 * Loads HTML components for the mobile view.
 * @async
 * @function loadHtmlComponentsForMobile
 * @returns {Promise<void>}
 */
async function loadHtmlComponentsForMobile() {
    currentView = "mobile"
    clearAddTaskHtmlBody();

    await includeHtmlForNode("body", "summaryMobile.html")

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobile.html"),
    ]);
    setHeightInMobileMode();
    await loadingSummaryMobileData();
}

/**
 * @function loadingSummaryMobileData
 * @memberof summary
 * Handles loading data and animations for the mobile summary view.
 * @async
 * @function loadingSummaryMobileData
 * @returns {Promise<void>}
 */
async function loadingSummaryMobileData() {
    if(!isStartupSummary){
        removeMobileGreetingAnimation();
        showLoadingAnimation();
    }
    renderGreetings('greeting-mobile-content', 'greeting-mobile-name');
    await loadTasksforSummary();
    setMobileGreetingAnimation();

    if(!isStartupSummary){
        hideLoadingAnimation();
    }
}

/**
 * @function includeCSSToHead
 * @memberof summary
 * Includes a CSS file in the document head.
 * @param {string} href - The path to the CSS file.
 * @return {void}
 */
function includeCSSToHead(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}


/**
 * @function clearAddTaskHtmlBody
 * @memberof summary
 * Clears the current HTML body content.
 * @returns {void}
 */
function clearAddTaskHtmlBody() {
    document.querySelector('body').innerHTML = "";
}


/**
 * @function setMobileGreetingAnimation
 * @memberof summary
 * Sets the mobile greeting animation.
 * @returns {void}
 */
function setMobileGreetingAnimation() {
    if (!isStartupSummary) {
        return; 
    }
    showOverlay();
    const greetingContainer = document.querySelector('.greeting-mobile-container');
    if(!greetingContainer){return;}

    greetingContainer.style.animation = "fadeBackgroundGreeting 1600ms ease-in-out forwards";
    setTimeout(()=>{
        hideOverlay();
    },1600);
}

/**
 * @function removeMobileGreetingAnimation
 * @memberof summary
 * Removes the mobile greeting animation.
 * @returns {void}
 */
function removeMobileGreetingAnimation() {
    const greetingContainer = document.querySelector('.greeting-mobile-container');
    if(!greetingContainer){return;}
    greetingContainer.classList.add("d-none");
    greetingContainer.style.animation = "none";
}

/**
 * @function setHeightInMobileMode
 * @memberof summary
 * Sets the height for the mobile view.
 * @returns {void}
 */
function setHeightInMobileMode() {
    const [height, width] = getCurrentWindowSize();
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    const summaryContent = document.getElementById('summary');

    if(!header || !navbar || !summaryContent){return;}

    height <= 845 ? summaryContent.classList.add('summary-section-mobile-scrollable') : summaryContent.classList.remove('summary-section-mobile-scrollable');
    
    const headerHeight = header.offsetHeight;
    const navbarHeight = navbar.offsetHeight;
    const availableHeight = height - (headerHeight + navbarHeight + 20);
    summaryContent.style.height = `${availableHeight}px`;
}


/**
 * @function loadTasksforSummary
 * @memberof summary
 * Loads tasks from Firebase, calculates summary statistics, and updates the UI.
 * @async
 * @function loadTasksforSummary
 * @returns {Promise<void>}
 * @description This function fetches all tasks from the Firebase database, computes various summary statistics such as the number of tasks in different states and the next due date, and then updates the HTML elements to display this information.
 */
async function loadTasksforSummary() {
    checkUserOrGuestIsloggedIn();
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getAllData("tasks"));
    let summaryVariables = getVariablesForSummary();
    summaryVariables = getSummaryCounts(tasks, summaryVariables);
    let nextDueDate = checkDate(tasks);
    renderNewSummary(tasks, summaryVariables, nextDueDate);
    renderUserInitial();
}

/**
 * @function getSummaryCounts
 * @memberof summary
 * Updates the summaryVariables object based on the current tasks.
 * @param {Array} tasks
 * @param {Object} summaryVariables
 * @returns {Object} summaryVariables
 * @description This function iterates through the list of tasks and updates the summaryVariables object with counts of tasks in different states and priorities.
 */
function getSummaryCounts(tasks, summaryVariables) {
    tasks.forEach(task => {
        summaryVariables.numberOfTodo += task.taskStateCategory === 'todo' ? 1 : 0;
        summaryVariables.numberOfInProgress += task.taskStateCategory === 'inprogress' ? 1 : 0;
        summaryVariables.numberOfAwaitingFeedback += task.taskStateCategory === 'awaiting' ? 1 : 0;
        summaryVariables.numberOfDone += task.taskStateCategory === 'done' ? 1 : 0;
        summaryVariables.tasksUgent += task.priority === 'Urgent' ? 1 : 0;
    });
    return summaryVariables;
}

/**
 * @function getVariablesForSummary
 * @memberof summary
 * This function initializes and returns an object to hold summary statistics.
 * @returns {Object} summaryVariables
 * @description The returned object contains properties for counting tasks in various states and priorities, all initialized to zero.
 */
function getVariablesForSummary() {
    const summaryVariables = {
        numberOfTodo: 0,
        numberOfInProgress: 0,
        numberOfAwaitingFeedback: 0,
        numberOfDone: 0,
        tasksUgent: 0
    };
    return summaryVariables;
}
/**
 * @function renderNewSummary
 * @memberof summary
 * Renders the summary information on the UI.
 * @param {Array} tasks
 * @param {Object} summaryVariables
 * @param {Date} nextDueDate
 * @description This function updates the HTML elements with the calculated summary statistics and the next due date.
 * @returns {void}
 */
function renderNewSummary(tasks, summaryVariables, nextDueDate) {
    document.getElementById('summary-todo').innerHTML = summaryVariables.numberOfTodo;
    document.getElementById('summary-inprogress').innerText = summaryVariables.numberOfInProgress;
    document.getElementById('summary-awaiting').innerText = summaryVariables.numberOfAwaitingFeedback;
    document.getElementById('summary-done').innerText = summaryVariables.numberOfDone;
    document.getElementById('summary-urgent').innerText = summaryVariables.tasksUgent;
    document.getElementById('summary-board').innerHTML = tasks.length;
    document.getElementById('urgent-time').innerHTML = nextDueDate;
}

/**
 * @function parseDueDate
 * @memberof summary
 * Parses a due date string in the format "DD/MM/YYYY" and returns a Date object.
 * @param {string} dueDateStr
 * @returns {Date}  A Date object representing the parsed due date.
 * @description This function splits the input string by '/' to extract the day, month, and year, then constructs a Date object in the format "YYYY-MM-DD".
 */
function parseDueDate(dueDateStr) {
    const [day, month, year] = dueDateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
}

/**
 * @function getFutureDueDates
 * @memberof summary
 * Gets the future due dates from the list of tasks.
 * @param {Array} tasks
 * @returns {Array<Date>} An array of Date objects representing the future due dates.
 * @description This function maps over the tasks to parse their due dates, then filters out any dates that are in the past or invalid.
 */
function getFutureDueDates(tasks) {
    const today = new Date();
    return tasks
        .map(task => parseDueDate(task.dueDate))
        .filter(date => date >= today && !isNaN(date));
}

/**
 * @function getNextDueDate
 * @memberof summary
 * Gets the next due date from the list of future due dates.
 * @param {Array<Date>} futureDates
 * @returns {Date|null} The next due date or null if there are no future dates.
 * @description This function finds the earliest date in the array of future dates using Math.min and returns it as a Date object. If there are no future dates, it returns null.
 */
function getNextDueDate(futureDates) {
    if (futureDates.length === 0) return null;
    return new Date(Math.min(...futureDates));
}
/**
 * @function formatDate
 * @memberof summary
 * Formats a date object into a human-readable string.
 * @param {Date} date
 * @returns {string} A formatted date string.
 * @description This function extracts the day, month, and year from the Date object and returns a string in the format "Month Day, Year". If the date is null or undefined, it returns an empty string.
 */
function formatDate(date) {
    if (!date) return '';
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return (`${month} ${day}, ${year}`);
}

/**
 * @function checkDate
 * @memberof summary
 * Checks and returns the next due date in a formatted string.
 * @param {Array} tasks
 * @returns {string} A formatted date string representing the next due date.
 * @description This function retrieves future due dates from the tasks, determines the next due date, formats it, and returns the formatted string.
 */
function checkDate(tasks) {
    const futureDates = getFutureDueDates(tasks);
    let futureDate = getNextDueDate(futureDates);
    let formatedDateString = formatDate(futureDate);
    return formatedDateString;
}






