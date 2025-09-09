class AddTaskUtils {

    readCurrentUserID() {
        return sessionStorage.getItem('logInStatus');
    }

    isCurrentUserGuest() {
        return sessionStorage.getItem('logInStatus') == "0";
    }

    //NOTE - einen Kontakt in der Assigned Liste suchen, sofern vorhanden. Damit das Aussehen angepasst werden kann.
    findContactInAssignList(contact, currentContactAssignList) {
        if (currentContactAssignList.length == 0) { return false; }
        return this.getIndexOfObjectOfArray(contact['id'], currentContactAssignList) != -1;
    }

    //NOTE - Prüfen, ob der Kontakt überhaupt vorhanden ist
    checkIfContactAvailable(currentContactID, contactAllListFromDB) {
        return this.getIndexOfObjectOfArray(currentContactID, contactAllListFromDB) != -1;
    }

    //NOTE Den Kontakt mit der ID aus dem gesammten Array filtern und in die Assigned Liste einfügen
    contactAddToTask(currentContactID, contactAllListFromDB, currentContactAssignList) {
        const indexOfContact = this.getIndexOfObjectOfArray(currentContactID, contactAllListFromDB);
        if (indexOfContact > -1) {
            currentContactAssignList.push(contactAllListFromDB[indexOfContact]);
        }
        return currentContactAssignList;
    }

    //NOTE - Den Kontakt mit der ID in der Assigned Liste suchen und dann entfernen
    contactRemoveFromTask(currentContactID, currentContactAssignList) {
        const indexOfContact = this.getIndexOfObjectOfArray(currentContactID, currentContactAssignList);
        if (indexOfContact > -1) {
            currentContactAssignList.splice(indexOfContact, 1);
        }
        return currentContactAssignList;
    }

    getIndexOfObjectOfArray(obejctID, objectArray) {

        let objectFind = objectArray.find(x => x['id'] == obejctID);
        if (objectFind == null) { return -1; }
        return objectArray.indexOf(objectFind);
    }

    filterContacts(inputValue, contactAllListFromDB) {
        const inputCleanValue = (inputValue ?? "").trim();
        if (inputCleanValue.length < 2) { return; }
        return contactAllListFromDB.filter((c) => c['firstname'].toLowerCase().startsWith(inputCleanValue.toLowerCase()));
    }

    addSubtaskToArray(subTaskEntry, currentSubTasks) {

        const newSubTask = {
            'id': getNewUid(),
            'title': subTaskEntry,
            'taskChecked': false
        };

        currentSubTasks.push(newSubTask);
        return currentSubTasks;
    }

    removeSubtaskFromArray(subtaskID, currentSubTasks){
        let indexOfSubtask = this.getIndexOfObjectOfArray(subtaskID, currentSubTasks);
        if(indexOfSubtask < 0 ){return currentSubTasks;}
        currentSubTasks.splice(indexOfSubtask, 1);
        return currentSubTasks;
    }
}