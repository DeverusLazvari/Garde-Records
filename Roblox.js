import EventEmitter from 'events';
import Database from "./Database.js";
import noblox from "noblox.js";
import User from "./User.js";
import Log from "./Log.js";

const Roblox = {
    empireFrancais: 5610765,
    gardeImperiale: 6057395
}

let UserStatusChanged = new EventEmitter();

/**
 * Fetches the users from the ROBLOX Group and returns them as an array.
 * @param {number} groupId The ROBLOX Group to fetch the users from.
 * @returns {Promise<Array<User>>} Array of users in the group.
 */
async function GetUsersInGroup(groupId) {
    let users = [];

    // Fetch roles.
    const roles = await noblox.getRoles(groupId);

    // Fetch members in the roles.
    for(let role of roles) {
        // Check for members.
        if(!role.memberCount) {
            continue;
        }
        
        // Fetch members.
        let members = await noblox.getPlayers(groupId, role.id);

        // Add members to the users.
        for(let member of members) {
            let data = {
                userId: member.userId,
                rank: role.rank,
                rankId: role.id,
                rankName: role.name,
            }

            users.push(await new User(data));
        }
    }

    return users;
}

/**
 * Scans for any changes such as a new user joining or a user leaving.
 * @returns {Promise<void>}
 */
async function ScanForChanges() {
    // Variables
    const currentUsers = await GetUsersInGroup(Roblox.gardeImperiale);
    const joinedText = [];
    const rankChangedText = [];
    const leftText = [];
    const auditedUsers = {};

    // Loop through all current users.
    for(let user of currentUsers) {
        auditedUsers[user.userId] = true;

        // Get old user.
        let oldUser = Database.getUser(user.userId);

        // Check if the user is in the database.
        if(!oldUser | (oldUser && !oldUser.isMember)) {
            let isReturning = oldUser && !oldUser.isMember
            let joinMessage = `${user.username}${isReturning ? ' has returned to' : ' has joined'} the group`;

            joinedText.push(joinMessage);
            Log.addLog(`[Roblox] ${joinMessage}`);
            UserStatusChanged.emit('newUser', user);

            Database.addUser(user);
            
        }
        else {
            // Get the rank change.
            let rankChange = user.rank - oldUser.rank;

            // Update the rank in the database.
            Database.updateUser(user.userId, 'rank', user.rank);

            // Check if the rank has changed.
            if(rankChange == 0) {
                continue;
            }

            // Add the rank change to the array.
            let rankChangedMessage = `${user.username} has changed their rank from ${oldUser.rankName} to ${user.rankName}`;
            rankChangedText.push(rankChangedMessage);
            Log.addLog(`[Roblox] ${rankChangedMessage}`);

            // Update the rank name
            Database.updateUser(user.userId, 'rankName', user.rankName);

            // Update the rank id
            Database.updateUser(user.userId, 'rankId', user.rankId);

            // Update any listeners.
            UserStatusChanged.emit('rankChanged', user, rankChange);
        }
    }

    // Fetch all unaudited users.
    let unauditedUsers = [];
    let keys = Object.keys(Database.users);
    for(let key of keys) {
        if(!auditedUsers[key]) {
            unauditedUsers.push(Database.users[key]);
        }
    }

    // Loop through all unaudited users.
    for(let user of unauditedUsers) {
        let leftMessage = `${user.username} has left the group`;
        leftText.push(leftMessage);
        Log.addLog(`[Roblox] ${leftMessage}`);

        // Update the users rank to 0.
        Database.updateUser(user.userId, 'rank', 0);

        // Update any listeners.
        UserStatusChanged.emit('userLeft', user);
    }
}

Object.assign(Roblox, {
    GetUsersInGroup,
    ScanForChanges,
    UserStatusChanged
});

export default Roblox;