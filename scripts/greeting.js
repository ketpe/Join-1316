async function renderGreetings(elementIdTimeOfDay, elementIdName) {
    let logInStatus = sessionStorage.getItem('logInStatus');
    const currentPartOfDay = getTimeOfDay();
    const currentGreetingName = await getGreetingName(logInStatus);
    renderGreetingInUI(elementIdTimeOfDay, elementIdName, currentPartOfDay, currentGreetingName);
};


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

async function getGreetingName(logInStatus) {

    if (logInStatus === "0") { return null; }
    if (logInStatus === "Guest") { return null; }

    const fb = new FirebaseDatabase();
    const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("id", logInStatus, "contacts"));
    return logInUser ? `${logInUser.firstname} ${logInUser.lastname}` : null;
};

function renderGreetingInUI(timeOfDayElementID, greetingElementID, timeOfDayValue, greetingValue){
    const timeOfDayElement = document.getElementById(timeOfDayElementID);
    const greetingElement = document.getElementById(greetingElementID);

    if(!timeOfDayElement || !greetingElement){return;}

    timeOfDayElement.innerHTML = timeOfDayValue;
    greetingElement.innerHTML = greetingValue;
}
