function addTaskContactOption(contact){
    return `
      <button id="uuid-from-contact" type="button" class="contact-list-btn" active="false" onclick="contactButtonOnListSelect(this)">
                            <div class="contact-profil-container">
                                <div class="contact-ellipse cyan"><span>SM</span></div>
                                <p>Solfa Müller</p>
                            </div>
                            <div class="contact-check-icon contact-unchecked" role="img" title="Check or uncheck Icon"></div>
                        </button>
    `;
}