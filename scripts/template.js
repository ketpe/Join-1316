function addTaskContactOption(contact){
    return `
       <option value="${contact['id']}">
            <p>${contact['firstname']}</p>
       </option>
    
    `;
}