
function loginLoaded() {

    let param = new URLSearchParams(document.location.search);
    let pageParam = param.get('isNotStartup');

    const isStartup = pageParam == null || pageParam.length == 0 || pageParam.startsWith('false') ? true : false;

    if (pageParam != null && pageParam.length > 0) {
        param.delete('isNotStartup');
        window.history.replaceState({}, document.title, '/index.html');
    }

    if (!isStartup) { return; }

    const [height, width] = getCurrentWindowSize();

    width <= 500 ? changeAnimationToMobileMode() : changeAnimationToDesktopMode();
}


function changeAnimationToMobileMode() {
    const loginLogo = document.querySelector('.login-join-logo');
    const loginSection = document.querySelector('.login-section');
    const loginBody = document.querySelector('body');
    loginSection.style.animation = 'startup 500ms ease-in';
    loginLogo.style.animation = 'moveLogoMobile 600ms ease-in-out forwards';
    loginBody.style.animation = 'fadeBackground 600ms ease-in-out forwards';
}

function changeAnimationToDesktopMode() {
    const loginLogo = document.querySelector('.login-join-logo');
    const loginSection = document.querySelector('.login-section');
    loginLogo.style.animation = 'moveLogo 500ms ease-in-out forwards';
    loginSection.style.animation = 'startup 500ms ease-in';
}


function loginResize() {
    const loginLogo = document.querySelector('.login-join-logo');
    const loginBody = document.querySelector('body');
    const loginSection = document.querySelector('.login-section');
    loginLogo.style.animation = 'none';
    loginBody.style.animation = 'none';
    loginSection.style.animation = 'none';
}


function loginFormSubmit(event) {
    event.preventDefault();
    let signIn = new FormData(event.target);
    let email = signIn.get("email");
    let password = signIn.get("password");
    checkLogin(email, password);
};


function loginInputFieldsOnInput(input) {
    if(!input){return;}

    if(input.value && input.value.length >= 3){
        removeErrorMessage('login-error-text');
    }
}

function loginInputFieldsOnBlur(input){
    if(!input){return;}
    if(input.value && input.value.length >= 3){
        toggleBorderColorByError(input.id, true);
    }else{
        toggleBorderColorByError(input.id, false);
    }
}

async function checkLogin(email, password) {
    const fb = new FirebaseDatabase();
    const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
    if (logInUser && logInUser.password === password && logInUser.email === email) {
        setLogStatus(logInUser.id);
        navigateToSummary();
    } else {
        setLogStatus('0');
        toggleBorderColorByError();
        document.getElementById("password").value = '';
        showErrorMessage('login-error-text');
    }
};

function loginGuest() {
    setLogStatus('Guest');
    navigateToSummary();
};






