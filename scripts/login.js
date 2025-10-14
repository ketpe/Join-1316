
function loginUpdateUIElements(){
    const [height, width] = getCurrentWindowSize();

    const loginBody = document.querySelector('body');

    if(width <= 500 && !loginBody.classList.contains('login-mobile-aninmation')){
        loginBody.classList.add('login-mobile-aninmation');
    }else{
        loginBody.classList.remove('login-mobile-aninmation');
    }
}



function loginForm(event) {
    event.preventDefault();
    let signIn = new FormData(event.target);
    let email = signIn.get("email");
    let password = signIn.get("password");
    checkLogin(email, password);
};

async function checkLogin(email, password) {
    const fb = new FirebaseDatabase();
    const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    if (logInUser && logInUser.password === password && logInUser.email === email) {
        setLogStatus(logInUser.id);
        navigateToSummary();
    } else {
        setLogStatus('0');
        toggleBorderColorByError();
        showErrorMessage('Check your email and password. Please try again.')
        document.getElementById("password").value = '';
    }
};

function loginGuest() {
    setLogStatus('0');
    navigateToSummary();
};




