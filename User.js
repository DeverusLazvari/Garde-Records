import noblox from "noblox.js";

class User {
    // Constructor
    constructor(data) {
        return ( async () => {
            this.userId = data.userId;
            this.username = await noblox.getUsernameFromId(data.userId); // Make sure the username is up to date.
            this.rank = data.rank;
            this.isMember = data.rank > 0;
            this.rankId = data.rankId;
            this.rankName = data.rankName;

            return this;
        })();
    }

    // Methods
    setValue(key, value) {
        this[key] = value;

        // Update isMember
        if (key === 'rank') {
            this.isMember = value > 0;
        }
    }
}

export default User;