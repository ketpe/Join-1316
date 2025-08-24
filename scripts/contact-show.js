async function openContactDetail(id) {
    let detailContact = await getDataByKey(key = "id", values = id, tableName = "contacts");
    let currentContactInList = document.getElementById(id);
    console.log(currentContactInList);
    toggleActiveContactInList(currentContactInList)
    console.log(detailContact);
    let renderDetailContact = document.getElementById('contact-detail-content');
    renderDetailContact.innerHTML = "";
    renderDetailContact.innerHTML = getContactDetailView(detailContact);
}

function toggleActiveContactInList(currentContactInList) {
    currentContactInList.classList.toggle("active");
}