function renderGreetings() {
    logInStatus = sessionStorage.getItem("logInStatus");
    renderGreetingTime();
    renderGreetingName();
};

function renderGreetingTime() {
    let renderGreetingsResultRef = document.getElementById("greeting");
    renderGreetingsResultRef.innerHTML = "";
    renderGreetingsResultRef.innerHTML += timeOfDay(logInStatus);
};

function timeOfDay(logInStatus) {
    let now = new Date();
    let hours = now.getHours();
    let greetBack = "";
    if (logInStatus = 1) {
        hours < 12 ? greetBack = "Good Morning," : hours < 18 ? greetBack = "Good Afternoon," : greetBack = "Good Evening,";
    } else {
        hours < 12 ? greetBack = "Good Morning!" : hours < 18 ? greetBack = "Good Afternoon!" : greetBack = "Good Evening!";
    }
    return greetBack;
};

function renderGreetingName() {
    let renderGreetingNameResultRef = document.getElementById("greetingName");
    renderGreetingNameResultRef.innerHTML = "";
    let logInUser = getDataByKey("id", logInStatus, "contact");
    if (logInStatus != 0) {
        let firstname = logInUser.firstName;
        let lastname = logInUser.lastName;
        renderGreetingsResultRef.innerHTML += `${firstname}` + ' ' + `${lastname}`;
    };
};
