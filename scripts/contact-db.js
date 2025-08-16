
//Beispiel zum erstellen eines neuen 
async function newContakt() {
    
    const uid = getNewUid();

    let contact = {
        'id': uid,
        'firstname': 'Peter',
        'lastname': 'Ketterlinus',
        'password': '1234',
        'email': 'enrico@test.de',
        'phone': '+460706746',
        'initial': 'EH',
        'initialColor': '--bg-cyan'
    };


    var t = await putData(`/contacts/${contact['id']}`, contact);

    console.log(uid);
}

//alle Kontakte als Liste abrufen
async function allCantacts() {
    let t = await getAllData('contacts');
    console.log(t);
    
}

//einen Kontakt löschen
async function deleteContactByID(id = "") {

    let res = await deleteData(`/contacts/${id}`);

    console.log(res);
    
}

//einen Kontakt für die ID suchen
async function getContactByID(id="") {
    let contact = await getDataByKey("id", id, "contacts");

    console.log(contact);
}