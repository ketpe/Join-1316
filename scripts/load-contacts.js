async function renderContacts() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    const contacts = await getAllData("contacts");
    console.log(contacts);
    let contactssorted = contacts.sort((a, b) => a.firstname.localeCompare(b.firstname));
    console.log(contactssorted);

    let currentLetter = null;
    let htmlOutput = ""

    for (const obj of contactssorted) {
        let firstLetter = obj.firstname[0].toUpperCase();
        //NOTE - Prüft ob Der erste Buchstaben im aktuellen lauf den gleichen Buchstaben hat wie in currentLetter
        if (firstLetter !== currentLetter) {
            //NOTE - Falls ja wird ein neuer Trenner erstellt

            if (currentLetter !== null) {
                // contactList.innerHTML += getContactListHeaderTemplate(firstLetter);

                // currentLetter = firstLetter;
                // contactList.innerHTML += htmlOutput;

            }
            contactList.innerHTML += getContactListHeaderTemplate(firstLetter);
            contactList.innerHTML += getContactListContent(obj);

            // contactList.innerHTML += htmlOutput;
        }
    }

}

