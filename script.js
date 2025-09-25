
async function init() {
    await Promise.all([
        includeHtml("navbar", "navbarDesktop.html"),
        includeHtml("header", "headerDesktop.html")
    ]);

    renderUserInitial();
}

async function renderUserInitial() {
    let logInStatus = getLogStatus();
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

function togglePasswordVisibility(toggleCounter, passwortInputID, toggleIconID) {
    let passwordInput = document.getElementById(passwortInputID);
    let toggleIcon = document.getElementById(toggleIconID);
    let togglePasswordVisibilityArray = {
        1: ["login-password-lock", "login-password-visible-off", 2, "password"],
        2: ["login-password-visible-off", "login-password-visible-on", 3, "text"],
        3: ["login-password-visible-on", "login-password-lock", 1, "password"],
    };
    if (togglePasswordVisibilityArray[toggleCounter]) {
        let [from, to, next, type] = togglePasswordVisibilityArray[toggleCounter];
        toggleIcon.classList.replace(from, to);
        passwordInput.type = type;
        toggleIcon.onclick = () => togglePasswordVisibility(next, passwortInputID, toggleIconID);
    };
}

function toggleBorderColorByError(elementId = null) {
    let elementsRef;
    if (elementId) {
        let elementRef = document.getElementById(elementId);
        if (!elementRef) return;
        elementsRef = [elementRef];
    } else {
        elementsRef = document.querySelectorAll(".login-signup-input, .loginErrorBorder");
    }
    elementsRef.forEach(elementRef => {
        elementRef.classList.replace("login-signup-input", "loginErrorBorder");
    });
    setTimeout(() => {
        elementsRef.forEach(elementRef => {
            elementRef.classList.replace("loginErrorBorder", "login-signup-input");
        });
    }, 3000);
}

