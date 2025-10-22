
/**
 * Renders the greeting message based on the time of day and user name. 
 * @async
 * @function renderGreetings
 * @param {*} elementIdTimeOfDay 
 * @param {*} elementIdName 
 */
async function renderGreetings(elementIdTimeOfDay, elementIdName) {
    let logInStatus = sessionStorage.getItem('logInStatus');
    const currentPartOfDay = getTimeOfDay(logInStatus);
    const currentGreetingName = await getGreetingName(logInStatus);
    renderGreetingInUI(elementIdTimeOfDay, elementIdName, currentPartOfDay, currentGreetingName);
};

/**
 * Determines the time of day greeting based on the current hour.  
 * @param {string} logInStatus 
 * @returns {string} The appropriate greeting message.
 */
function getTimeOfDay(logInStatus) {
    let now = new Date();
    let hours = now.getHours();
    let greetBack = "";
    if (logInStatus === 'Guest') {
        hours < 12 ? greetBack = "Good Morning!" : hours < 18 ? greetBack = "Good Afternoon!" : greetBack = "Good Evening!";
    } else {
        hours < 12 ? greetBack = "Good Morning," : hours < 18 ? greetBack = "Good Afternoon," : greetBack = "Good Evening,";
    }
    return greetBack;
};

/**
 * Fetches the user's name based on their login status.
 * @param {String} logInStatus 
 * @returns {Promise<string|null>} The user's full name or null if not logged in.
 */
async function getGreetingName(logInStatus) {

    if (logInStatus === "0") { return null; }
    if (logInStatus === "Guest") { return null; }

    const fb = new FirebaseDatabase();
    const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("id", logInStatus, "contacts"));
    return logInUser ? `${logInUser.firstname} ${logInUser.lastname}` : null;
};

/**
 * Renders the greeting message in the UI.
 * @param {string} timeOfDayElementID 
 * @param {string} greetingElementID 
 * @param {string} timeOfDayValue 
 * @param {string} greetingValue 
 * @returns {void}
 */
function renderGreetingInUI(timeOfDayElementID, greetingElementID, timeOfDayValue, greetingValue){
    const timeOfDayElement = document.getElementById(timeOfDayElementID);
    const greetingElement = document.getElementById(greetingElementID);

    if(!timeOfDayElement || !greetingElement){return;}

    timeOfDayElement.innerHTML = timeOfDayValue;
    greetingElement.innerHTML = greetingValue;
}
