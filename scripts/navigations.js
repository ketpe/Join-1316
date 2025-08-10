function navigateToSignUp() {
    window.location.href = './signup.html';
}

function navigateToSummaryGuest(){
    window.location.href = './summary-desktop.html';
}

function navigateToPrivacy(target = "") {

    if(target == "login"){
        window.location.href = './privacy-policy.html?backToLogin=true';
    }else{
        window.location.href = './privacy-policy.html';
    }

}

function navigateToLogin() {
    window.location.href = './index.html';
}