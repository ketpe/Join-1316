async function newContact(event) {
    if (event) event.preventDefault(); // verhindert das Neuladen der Seite
    const uid = getNewUid();
    const contact = createContactObject(uid);
    var t = await putData(`/contacts/${uid}`, contact);
    console.log(uid);
    console.log(contact);
}

function createContactObject(uid) {
    const { firstname, lastname, email, phone } = getContactFormData();
    return {
        'id': uid,
        'firstname': firstname,
        'lastname': lastname,
        'password': '1234',
        'email': email,
        'phone': phone,
        'initial': getInitials(firstname, lastname),
        'initialColor': getRandomColor(),
    };
}

function getContactFormData() {
    const completeName = document.getElementById('contact-name').value;
    const [firstname, lastname] = completeName.split(" ");
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    return { firstname, lastname, email, phone };
}

function getInitials(firstname, lastname) {
    return firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();
}

function getRandomColor() {
    const colorClasses = [
        'orange', 'vilolet', 'coral', 'gold', 'lemon', 'red', 'blue',
        'peach', 'cyan', 'pink', 'indigo', 'mint', 'magenta', 'lime', 'amber'
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}


