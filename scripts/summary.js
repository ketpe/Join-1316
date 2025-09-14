async function loadTasksforSummary() {
    const fb = new FirebaseDatabase();
    let tasks = await fb.getFirebaseLogin(() => fb.getAllData("tasks"));
    console.log(tasks);

    let summaryVariables = getVariablesForSummary();
    console.log(summaryVariables);

    summaryVariables = getSummeryCounts(tasks, summaryVariables);

    renderNewSummery(tasks, summaryVariables);

    let dueDate = checkDate(tasks);
}

function getSummeryCounts(tasks, summaryVariables) {
    tasks.forEach(task => {
        summaryVariables.numberOfTodo += task.taskStateCategory === 'todo' ? 1 : 0;
        summaryVariables.numberOfInProgress += task.taskStateCategory === 'inprogress' ? 1 : 0;
        summaryVariables.numberOfAwaitingFeedback += task.taskStateCategory === 'awaiting' ? 1 : 0;
        summaryVariables.numberOfDone += task.taskStateCategory === 'done' ? 1 : 0;
        summaryVariables.tasksUgent += task.priority === 'Urgent' ? 1 : 0;
    });
    return summaryVariables;
}

function getVariablesForSummary() {
    const summaryVariables = {
        numberOfTodo: 0,
        numberOfInProgress: 0,
        numberOfAwaitingFeedback: 0,
        numberOfDone: 0,
        tasksUgent: 0
    };
    return summaryVariables;
}

function renderNewSummery(tasks, summaryVariables) {
    document.getElementById('summary-todo').innerHTML = summaryVariables.numberOfTodo;
    document.getElementById('summary-inprogress').innerText = summaryVariables.numberOfInProgress;
    document.getElementById('summary-awaiting').innerText = summaryVariables.numberOfAwaitingFeedback;
    document.getElementById('summary-done').innerText = summaryVariables.numberOfDone;
    document.getElementById('summary-urgent').innerText = summaryVariables.tasksUgent;
    document.getElementById('summary-board').innerHTML = tasks.length;
}

function checkDate(tasks) {
    let heute = new Date();
    let nächsteDueDate = null;

    // Alle zukünftigen Datumswerte sammeln
    const futureDates = tasks
        .map(task => {
            // dueDate ist z.B. "27/11/2025"
            const [day, month, year] = task.dueDate.split('/');
            const dateObj = new Date(`${year}-${month}-${day}`);
            return dateObj >= heute ? dateObj : null;
        })
        .filter(date => date !== null && !isNaN(date));

    // Das früheste Datum finden
    if (futureDates.length > 0) {
        nächsteDueDate = new Date(Math.min(...futureDates));
        console.log('Nächstes Fälligkeitsdatum:', nächsteDueDate.toLocaleDateString('de-DE'));
    } else {
        console.log('Kein zukünftiges Fälligkeitsdatum gefunden.');
    }

    return nächsteDueDate;
};