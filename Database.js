import fs from 'fs';// Because we are not using a sql database, we will use the file system to read the data from the file.
import User from './User.js';
import Log from './Log.js';

class Database {
    // Constructor
    constructor(directory) {
        this.directory = directory;
        this.users = {};
    }

    // Methods
    /**
     * Fetches data from the json file and loads it into the Database object.
     * @returns {void}
     */
    async fetchData() {
        // Load users.json
        let data = fs.readFileSync(this.directory + '/users.json');

        // Parse the data
        let prasedData = JSON.parse(data);

        // Create users
        await this._createUsers(prasedData);   
    }

    /**
     * Parases an array of data and creates the users with the data.
     * @param {Array<FileData>} userData 
     * @returns {Promise<void>}
     */
    async _createUsers(userData) {
        // Loop through all user data
        for (let i = 0; i < userData.length; i++) {
            let data = userData[i];
            let newUser = await new User(data)
            this.users[newUser.userId] = newUser;
        }

        let AmountOfUsers = Object.keys(this.users).length;
        Log.addLog(`[Database] Created ${AmountOfUsers} users`);
    }

    /**
     * Saves the users to the json file.
     * @returns {Promise<void>}
     */
    async saveData() {
        // Convert users to an array
        let usersToSave = [];

        // Get all user objects and turn them into an array
        Object.keys(this.users).forEach(userId => {
            let data = {
                userId: this.users[userId].userId,
                username: this.users[userId].username,
                rank: this.users[userId].rank,
                rankId: this.users[userId].rankId,
                rankName: this.users[userId].rankName,
                isMember: this.users[userId].isMember
            };

            usersToSave.push(data);
        });

        // Save the data
        fs.writeFileSync(this.directory + '/users.json', JSON.stringify(usersToSave));
        Log.addLog(`[Database] Saved ${Object.keys(this.users).length} users`);
    }

    /**
     * Adds a new user object to the database.
     * @param {User} user The user object to add.
     * @returns {void}
     */
    addUser(user) {
        this.users[user.userId] = user;
        Log.addLog(`[Database] Created user ${user.username}, id: ${user.userId}`);
    }

    /**
     * Updates a user object with the key value pair.
     * @param {String} userId 
     * @param {String} key 
     * @param {any} value 
     * @returns {void}
     */
    updateUser(userId, key, value) {
        this.users[userId].setValue(key, value);
        //Log.addLog(`[Database] Updated user ${this.users[userId].username}, id: ${this.users[userId].userId}`);
    }

    /**
     * Returns a user object with the given user id.
     * @param {String} userId 
     * @returns {User | null}
     */
    getUser(userId) {
        return this.users[userId];
    }

}

export default new Database('.');