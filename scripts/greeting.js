document.addEventListener('DOMContentLoaded', function renderGreetings() {
    let renderGreetingsResultRef = document.getElementById("greeting");
    renderGreetingsResultRef.innerHTML = '';
    renderGreetingsResultRef.innerHTML += timeOfDay();
});

function timeOfDay() {
    let now = new Date();
    let hours = now.getHours();
    let greetBack = "";
    switch (true) {
        case hours < 12:
            greetBack = "Good Morning,";
            break;
        case hours < 18:
            greetBack = "Good Afternoon,";
            break;
        case hours < 24:
            greetBack = "Good Evening,";
            break;
        default:
            greetBack = "Welcome,";
            break;
    }
    return `${greetBack}`;
}
