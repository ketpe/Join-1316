function renderGreetings() {
    let logInStatus = sessionStorage.getItem('logInStatus');
    renderGreetingTime(logInStatus);
    renderGreetingName(logInStatus);
};

function renderGreetingTime(logInStatus) {
    let renderGreetingsResultRef = document.getElementById("greeting");
    renderGreetingsResultRef.innerHTML = "";
    renderGreetingsResultRef.innerHTML += timeOfDay(logInStatus);
};

function timeOfDay(logInStatus) {
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

async function renderGreetingName(logInStatus) {
    let renderGreetingNameResultRef = document.getElementById("greetingName");
    renderGreetingNameResultRef.innerHTML = "";

    if (logInStatus === "0") { return; }
    if (logInStatus === "Guest") { return; }

    const fb = new FirebaseDatabase();
    let logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("id", logInStatus, "contacts"));
    if (logInUser) {
        let firstname = logInUser.firstname;
        let lastname = logInUser.lastname;
        renderGreetingNameResultRef.innerHTML = `${firstname} ${lastname}`;
    } else {
        renderGreetingNameResultRef.innerHTML = "User not found";
    }
};
