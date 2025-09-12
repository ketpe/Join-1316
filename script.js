const BASE_URL = "https://join-1316-default-rtdb.europe-west1.firebasedatabase.app/";

async function init() {
    await Promise.all([
        includeHtml("navbar", "navbar-desktop.html"),
        includeHtml("header", "header-desktop.html")
    ]);

    renderUserInitial();
}

async function renderUserInitial() {
    let logInStatus = sessionStorage.getItem('logInStatus');
    let userinitial = "G";
    if (logInStatus !== "0") {
        let userinitialRef = await getDataByKey('id', logInStatus, 'contacts');
        userinitial = userinitialRef.initial;
    }
    let renderUserInitialRef = document.getElementById("user-initial-render");
    renderUserInitialRef.textContent = userinitial;
}


/**
 * 
 * @param {*} id 
 */
function toggleDNone(id, event) {
    if (event) event.stopPropagation();
    document.getElementById(id).classList.toggle('d-none')
};

/**
 * 
 * @param {*} event 
 */

function noBubbling(event) {
    event.stopPropagation()
};

document.addEventListener('click', function (event) {
    const respMenu = document.getElementById('resp-menu');
    if (
        respMenu &&
        !respMenu.classList.contains('d-none') &&
        !respMenu.contains(event.target)
    ) {
        respMenu.classList.add('d-none');
    }
});


function showErrorMessage(message) {
    let errorText = document.getElementById("login-error-text");
    errorText.textContent = message;
    errorText.classList.remove("d-none");
    setTimeout(() => errorText.classList.add("d-none"), 3000);
    location.reload();
}

