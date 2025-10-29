/**
 * Class for interacting with Firebase Realtime Database.
 * Provides methods for authentication, data retrieval, updating, and deletion.
 * @class FirebaseDatabase
 * @property {Object} constructor - The constructor for the FirebaseDatabase class.
 * @example
 * const firebaseDB = new FirebaseDatabase();
 */ 

class FirebaseDatabase {

    constructor() {}

    /**
     * Authenticates the user and executes the provided callback function.
     * @param {Function} callback - The callback function to execute after authentication.
     * @returns {Promise} A promise that resolves with the result of the callback function.
     */
    async getFirebaseLogin(callback) {

        return new Promise((resolve, reject) => {
            const unsubscribe = firebaseOnAutheChanged(firebaseAuth, async (user) => {
                if (!user) { return; }
                unsubscribe();
                try {
                    const resultData = await callback();
                    resolve(resultData);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Retrieves all data from the specified table.
     * @param {string} tableName - The name of the table to retrieve data from.
     * @returns {Array} An array of all data entries in the table.
     */
    async getAllData(tableName = "") {
        try {
            const database = firebaseGetDatabase();
            const databaseRef = firebaseRef(database);
            const databaseTableData = await firebaseGet(firebaseChild(databaseRef, tableName));

            return databaseTableData.exists() ? Object.values(databaseTableData.val()).filter(data => data != null) : [];
        } catch (error) {
            console.error(error.message);
            return [];
        }

    }

    /**
     * Retrieves data from the specified table by key and value.
     * @param {string} key - The key to search by.
     * @param {string|number} values - The value to match.
     * @param {string} tableName - The name of the table to search in.
     * @returns {Object|null} The found data object or null if not found.
     */
    async getDataByKey(key = "", values, tableName = "") {
        let dataArray = await this.getAllData(tableName);
        return dataArray.length > 0 ? dataArray.find(x => x[key] == values) : null;
    }

    /**
     * Retrieves and sorts all contacts by first name.
     * @returns {Array} An array of sorted contact objects.
     */
    async getSortedContact() {
        const contacts = await this.getAllData("contacts");
        let contactssorted = contacts.sort((a, b) => a.firstname.localeCompare(b.firstname));
        return contactssorted
    }

    /**
     * Updates data at the specified path.
     * @param {string} path - The path to the data to update.
     * @param {Object} data - The new data to set.
     * @returns {boolean} True if the update was successful, false otherwise.
     */
    async updateData(path, data) {

        try {
            const database = firebaseGetDatabase();
            const databaseRef = firebaseRef(database, path);
            await firebaseUpdate(databaseRef, data)
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Puts data at the specified path.
     * @param {string} path - The path to the data to set.
     * @param {Object} data - The data to set.
     * @returns {boolean} True if the operation was successful, false otherwise.
     */
    async putData(path, data) {
        try {
            const database = firebaseGetDatabase();
            const databaseRef = firebaseRef(database, path);
            await firebaseSet(databaseRef, data);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Deletes data at the specified path.
     * @param {string} path - The path to the data to delete.
     * @returns {boolean} True if the deletion was successful, false otherwise.
     */
    async deleteData(path) {
        try {
            const database = firebaseGetDatabase();
            const databaseRef = firebaseRef(database, path);
            await firebaseRemove(databaseRef);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Creates a new signed user and stores their data in the database.
     * @param {string} id - The user's ID.  
     * @param {string} firstname - The user's first name.
     * @param {string} lastname - The user's last name.
     * @param {string} pwd - The user's password.
     * @param {string} email - The user's email address.
     * @param {string} phone - The user's phone number.
     * @param {string} initial - The user's initials.
     * @param {string} initialColor - The color associated with the user's initials.
     * @returns {boolean} True if the user was created and data stored successfully, false otherwise.
     */
    async createNewSignedUser(id, firstname, lastname, pwd, email, phone, initial, initialColor) {
        const contact = new Contact(id, firstname, lastname, pwd, email, phone, initial, initialColor);
        const fb = new FirebaseDatabase();
        return await fb.getFirebaseLogin(() => fb.putData(`/contacts/${contact.id}`, contact));
    }

}
