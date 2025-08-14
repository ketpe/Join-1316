function onLoadAddTask(){

    let param = new URLSearchParams(document.location.search);
    let loadValue = param.get('loadValue');

    if(loadValue !== null && loadValue.startsWith("FromNav")){
        renderAddTaskWithNavAndHeader();
    }else{
        renderAddTaskAsOverlay();
    }

}


function renderAddTaskWithNavAndHeader() {
    includeHtml("navbar", "navbar-desktop.html");
    includeHtml("header", "header-desktop.html");
    includeHtml("add-task-content", "add-task.html");
}