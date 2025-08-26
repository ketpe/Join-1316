function renderGreetings() {
    let renderGreetingsResultRef = document.getElementById("greeting");
    renderGreetingsResultRef.innerHTML = '';
    renderGreetingsResultRef.innerHTML += timeOfDay();
};

function timeOfDay() {
    let now = new Date();
    let hours = now.getHours();
    let greetBack = "";
    hours < 12 ? greetBack = "Good Morning," : hours < 18 ? greetBack = "Good Afternoon," : greetBack = "Good Evening,";
    return greetBack;
};

