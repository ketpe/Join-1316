function navigateToSignUp() {
    window.location.href = './signup.html';
}

function navigateToSummaryGuest(){
    window.location.href = './summary-desktop.html';
}

function navigateToPrivacy(source = "") {

    if(source == "login"){
        window.location.href = './privacy-policy.html?backToLogin=true';
    }else{
        window.location.href = './privacy-policy.html';
    }

}

function navigateToLegalNotice(source) {
    if(source == "login" || source == "signin"){
        window.location.href = "./legal-notice.html?backToLogin=true";
    }else{
        window.location.href = "./legal-notice.html";
    }
}

function navigateToLogin() {
    window.location.href = './index.html';
}

function navigateToHelp(){

    const currentURL = window.location.pathname;

    

    console.log(currentURL);
    
    //window.location.href = './help.html';
}