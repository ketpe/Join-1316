
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
        const fb = new FirebaseDatabase();
        const userinitialRef = await fb.getFirebaseLogin(() => fb.getDataByKey('id', logInStatus, 'contacts'));
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
    let subMenu = document.getElementById('subMenu');
    if (
        subMenu &&
        !subMenu.classList.contains('d-none') &&
        !subMenu.contains(event.target)
    ) {
        subMenu.classList.add('d-none');
    }
});


function showErrorMessage(message) {
    let errorText = document.getElementById("login-error-text");
    errorText.textContent = message;
    errorText.classList.remove("d-none");
    setTimeout(() => errorText.classList.add("d-none"), 3000);
}

function getRandomColor() {
    const colorClasses = [
        'orange', 'violet', 'coral', 'gold', 'lemon', 'red', 'blue',
        'peach', 'cyan', 'pink', 'indigo', 'mint', 'magenta', 'lime', 'amber'
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

function getNewUid() {
    return crypto.randomUUID();
}

