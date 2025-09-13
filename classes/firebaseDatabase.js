/**
 * Beipiel 1:
 * const fb = new FirebaseDatabase();
 * const data = await fb.getFirebaseLogin(() => fb.getAllData('contacts'));
 * console.log(data);
 * Beispiel 2:
 * const fb = new FirebaseDatabase();
 * const logInUser = await fb.getFirebaseLogin(() => fb.getDataByKey("email", email, "contacts"));
 */


class FirebaseDatabase {

    constructor() {

    }

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

    async getDataByKey(key = "", values, tableName = "") {
        let dataArray = await this.getAllData(tableName);
        return dataArray.length > 0 ? dataArray.find(x => x[key] == values) : null;
    }


    async getSortedContact() {
        const contacts = await this.getAllData("contacts");
        let contactssorted = contacts.sort((a, b) => a.firstname.localeCompare(b.firstname));
        return contactssorted
    }

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


}