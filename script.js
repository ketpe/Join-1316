const BASE_URL = "https://join-1316-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
    includeHtml("navbar", "navbar-desktop.html");
    includeHtml("header", "header-desktop.html");
}


function includeHtml(target, file) {
    let element = document.getElementById(target);

    if (file) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    element.innerHTML = xhr.responseText;
                } else {
                    element.innerHTML = "Error loading file: " + file;
                }
            }
        };
        xhr.open("GET", file, true);
        xhr.send();
    }
}