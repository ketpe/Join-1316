/**
 * @fileoverview summary.js - Handles loading and displaying task summaries.
 */

let currentView = "";
const minDesktopHeight = 880;
const minDesktopWidth = 840;
const breakPointToDesktopSingle = 1180;

/**
 * Loads tasks from Firebase, calculates summary statistics, and updates the UI.
 * @async
 * @function loadTasksforSummary
 * @returns {Promise<void>}
 * @description This function fetches all tasks from the Firebase database, computes various summary statistics such as the number of tasks in different states and the next due date, and then updates the HTML elements to display this information.
 */
async function loadTasksforSummary() {
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getAllData("tasks"));
    let summaryVariables = getVariablesForSummary();
    summaryVariables = getSummeryCounts(tasks, summaryVariables);
    let nextDueDate = checkDate(tasks);
    renderNewSummery(tasks, summaryVariables, nextDueDate);
}

/**
 * Updates the summaryVariables object based on the current tasks.
 * @param {*} tasks
 * @param {*} summaryVariables
 * @returns summaryVariables
 * @description This function iterates through the list of tasks and updates the summaryVariables object with counts of tasks in different states and priorities.
 */
function getSummeryCounts(tasks, summaryVariables) {
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
 *
 * @returns summaryVariables
 * @description This function initializes and returns an object to hold summary statistics.
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
 * Renders the summary information on the UI.
 * @param {*} tasks
 * @param {*} summaryVariables
 * @param {*} nextDueDate
 * @description This function updates the HTML elements with the calculated summary statistics and the next due date.
 */
function renderNewSummery(tasks, summaryVariables, nextDueDate) {
    document.getElementById('summary-todo').innerHTML = summaryVariables.numberOfTodo;
    document.getElementById('summary-inprogress').innerText = summaryVariables.numberOfInProgress;
    document.getElementById('summary-awaiting').innerText = summaryVariables.numberOfAwaitingFeedback;
    document.getElementById('summary-done').innerText = summaryVariables.numberOfDone;
    document.getElementById('summary-urgent').innerText = summaryVariables.tasksUgent;
    document.getElementById('summary-board').innerHTML = tasks.length;
    document.getElementById('urgent-time').innerHTML = nextDueDate;
}

/**
 * Parses a due date string in the format "DD/MM/YYYY" and returns a Date object.
 * @param {*} dueDateStr
 * @returns {Date}  A Date object representing the parsed due date.
 * @description This function splits the input string by '/' to extract the day, month, and year, then constructs a Date object in the format "YYYY-MM-DD".
 */
function parseDueDate(dueDateStr) {
    const [day, month, year] = dueDateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
}

/**
 * Gets the future due dates from the list of tasks.
 * @param {*} tasks
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
 * Gets the next due date from the list of future due dates.
 * @param {*} futureDates
 * @returns {Date|null} The next due date or null if there are no future dates.
 * @description This function finds the earliest date in the array of future dates using Math.min and returns it as a Date object. If there are no future dates, it returns null.
 */
function getNextDueDate(futureDates) {
    if (futureDates.length === 0) return null;
    return new Date(Math.min(...futureDates));
}
/**
 * Formats a date object into a human-readable string.
 * @param {*} date
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
 * Checks and returns the next due date in a formatted string.
 * @param {*} tasks
 * @returns {string} A formatted date string representing the next due date.
 * @description This function retrieves future due dates from the tasks, determines the next due date, formats it, and returns the formatted string.
 */
function checkDate(tasks) {
    const futureDates = getFutureDueDates(tasks);
    let futureDate = getNextDueDate(futureDates);
    let formatedDateString = formatDate(futureDate);
    return formatedDateString;
}

async function onLoadSummary() {
    const [height, width] = getCurrentAddTaskSize();
    const head = document.getElementsByTagName('head');
    if (width >= minDesktopWidth) {
        await loadHtmlComponentsForDesktop(head);

    } else {
        await loadHtmlComponentsForMobile(head);

    }

}

async function loadHtmlComponentsForDesktop(head) {
    currentView = "desktop";
    clearAddTaskHtmlBody();
    await Promise.all([
        includeHtmlForNode("body", "summaryDesktop.html")
    ]);

    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html"),

    ]);
    loadTasksforSummary();
    renderGreetings();

}
/*REVIEW - möglichweise in script.js*/
function getCurrentAddTaskSize() {
    return [height, width] = [window.innerHeight, window.innerWidth];
}

async function loadHtmlComponentsForMobile() {
    currentView = "mobile"
    clearAddTaskHtmlBody();

    await Promise.all([
        includeHtmlForNode("body", "summaryMobile.html")
    ]);

    await Promise.all([
        includeHtml("header", "headerMobile.html"),
        includeHtml("navbar", "navbarMobil.html"),
    ]);
    loadTasksforSummary();
}

function includeCSSToHead(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function clearAddTaskHtmlBody() {
    document.querySelector('body').innerHTML = "";
}

async function addSummaryPageResize() {
    const [height, width] = getCurrentAddTaskSize();
    if ((width <= minDesktopWidth) && currentView != "mobile") {
        await loadHtmlComponentsForMobile();


    } else if (width >= minDesktopWidth + 1 && currentView != "desktop") {
        await loadHtmlComponentsForDesktop();

    }

}