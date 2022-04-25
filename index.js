import noblox from "noblox.js";
import fs from "fs";
import {Client, Intents} from "discord.js";
import TOKENS from "./sensitive_business/tokens.js";
const client = new Client({intents:[Intents.FLAGS.GUILDS]});

const empireFrancais = 5610765;
const gardeImperiale = 6057395;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function tryUntilSucceed(promiseFn) {
    try {
        return await promiseFn();
    } catch (e) {
        await sleep(5000);
        console.log(`|||FUNCTION ERRORED, RETRYING || ${e}`)
        return tryUntilSucceed(promiseFn);
    }
}

async function scanForGradeUpdates()
{
    // Get all old users.
    const oldUsersArray = JSON.parse(fs.readFileSync('./users.json'));
    const permUsersArray = JSON.parse(fs.readFileSync('./permusers.json'))
    let oldUsers = [];
    let currentUsers = [];
    let permUsers = [];

    // Parse the old users into a usable format.
    for (let i = 0; i < oldUsersArray.length; i++)
    {
        let userId = oldUsersArray[i].userId;
        oldUsers[userId] = oldUsersArray[i]
    }

    // Parse the perm users into a usable format.
    for (let i = 0; i < permUsersArray.length; i++)
    {
        let userId = permUsersArray[i];
        permUsers[userId] = permUsersArray[i]
    }

    // Fetch all roles in the group.
    let roles = await tryUntilSucceed(() => noblox.getRoles(gardeImperiale));

    // Loop through all roles.
    for(let role of roles){
        // Check if the role has members.
        if(!role.memberCount) { continue; }
                
        // Get all players in the role.
        let players = await tryUntilSucceed(() => noblox.getPlayers(gardeImperiale, role.id));

        // Loop through all players.
        for(let player of players){
            let userId = player.userId.toString();
            currentUsers[userId] = {
                username: player.username,
                rank: role.rank,
                rankId: role.id,
                rankName: role.name
            }
        }
    }

    // Compare the old users to the current users and find who has left.
    let leftText = [];
    let leftUsers = [];
    for(let playerId in oldUsers) {
        // Check if the player is in the current users list.
        if(!currentUsers[playerId]) {
            leftUsers.push(oldUsers[playerId]);

            // Output that the player has left.
            console.log(`${oldUsers[playerId].username} has left the garde, they were a ${oldUsers[playerId].rankName}`);

            // Create leave text.
            if(leftText[oldUsers[playerId].rank] == undefined) {
                leftText[oldUsers[playerId].rank] = [oldUsers[playerId].rankName];
            }
            leftText[oldUsers[playerId].rank].push(`${oldUsers[playerId].username} has left the garde, they were in ${oldUsers[playerId].rankName}`);

            // Check if the player is in empireFrancais above the rank 1.
            let rank = await tryUntilSucceed(() => noblox.getRankInGroup(empireFrancais, playerId));
            if(rank > 1 && rank < 12) {
                // Change the rank of the player to 1.
                await tryUntilSucceed(() => noblox.setRank(empireFrancais, playerId, 1));

                // Output thaat the player was ranked down.
                console.log(`--${oldUsers[playerId].username} was ranked down to Citoyen.`);

                // Check if player is already Citoyen.
            } else if (rank == 1) {

                // Output to log that player is already Citoyen.
                console.log(`--${oldUsers[playerId].username} is already Citoyen. No change necessary.`);

                // If player is not above Citoyen, and player is not at Citoyen, the player isn't in the group.
            } else {

                // Output to log that player is not in Empire Francais
                console.log(`--${oldUsers[playerId].username} is not in Empire Francais.`);
            }
        }
    }

    // Compare the current users to the old users and find who has joined.
    let joinedUsers = [];
    for(let playerId in currentUsers) {
        // Check if the player is in the old users list.
        if(!oldUsers[playerId]) {
            joinedUsers.push(currentUsers[playerId]);

            // Output that the player has joined.
            console.log(`${currentUsers[playerId].username} has joined the garde, they are a ${currentUsers[playerId].rankName}`);
            
            // Check if they have the rank id 40050642.
            // Check if the player is in empireFrancais not at the rank of 2.
            let rank = await tryUntilSucceed(() => noblox.getRankInGroup(empireFrancais, playerId));
            if(currentUsers[playerId].rankId == 40050642 && rank != 3 && rank <= 16 && rank != 0) {
                // Change the rank of the player to 2.
                await tryUntilSucceed(() => noblox.setRank(empireFrancais, playerId, 3));

                // Output thaat the player was ranked down.
                console.log(`--${currentUsers[playerId].username} was ranked to Soldat.`);

                // Check if player is new to JG, but is already Soldat.
            } else if (currentUsers[playerId].rankId == 40050642 && rank == 3){

                // Output to log that player is already Conscrit.
                console.log(`--${currentUsers[playerId].username} is already Soldat. No change necessary.`);
            } else if (rank == 0){
                await tryUntilSucceed(() => noblox.exile(gardeImperiale, playerId));
                console.log(`ACHTUNG!! ${currentUsers[playerId].username} is not in Empire Francais. Exiled from Garde.`)
            }
        }
    }

    // Compare current users to perm users, add new users to a list
    let newPermUsers = [];
    for(let playerId in currentUsers) {
        let userSearch = currentUsers[playerId].username;
        if(!permUsers[userSearch]){
            newPermUsers.push(userSearch);
        }
    }

    // Take list of new users, write it to permanent users array
    for(let username in newPermUsers){
        permUsersArray.push(newPermUsers[username]);
    }

    // Write new perm users to file
    console.log(`Writing ${permUsersArray.length} users to perm users file.`);
    fs.writeFileSync('./permusers.json', JSON.stringify(permUsersArray));

    // Convert the current users into an array so that we can convert it to JSON.
    let currentUsersArray = [];
    for(let playerId in currentUsers) {
        let data = currentUsers[playerId];
        data.userId = playerId;
        currentUsersArray.push(data);
    }

    // Write the current users to the file.
    console.log(`Writing ${currentUsersArray.length} users to current users file.`);
    fs.writeFileSync('./users.json', JSON.stringify(currentUsersArray));

    // Output that we have finished scanning.
    console.log("Finished scanning for grade updates.\nNow outputting pretty leave messages.");

    // Output the leave messages in console
    for(let rank in leftText) {
        console.log("==============================");
        for(let message of leftText[rank]) {
            if(message == "Jeune Garde" || message == "Moyenne Garde" || message == "Vieille Garde") {continue;}
            console.log(message);
        }
        console.log("==============================");
    }
    
    //Fetch output channel
    const outputChannelIds = ['955127605315633222'];

    //Output prior leave messages to channel
    console.log("Sending logs to discord...");

    //Build output string
    let outputString = ''
    for(let rank in leftText){
        outputString = (`${outputString}**${leftText[rank][0]}:**\n`);
        for(let message of leftText[rank]){
            if(message == "Jeune Garde" || message == "Moyenne Garde" || message == "Vieille Garde") {continue;}
            outputString = (`${outputString}> ${message}\n`);
        }
        outputString = (`${outputString}\n`);
    }

    //Get data from runtime file
    const runtimeArray = JSON.parse(fs.readFileSync('./runtime.json'));
    const lastRun = runtimeArray.lastRun;
    const timesRan = runtimeArray.totalRuns;

    //Build and send date, because why not 
    let ts = Math.round(Date.now() / 1000);
    
    //Verify that the outputstring isnt empty
    if (outputString != ''){

        for (let channelId in outputChannelIds){

            //Get channel object from cache with id
            const outputChannel = client.channels.cache.get(outputChannelIds[channelId]);

            //Send output string to discord.
            outputChannel.send(outputString);
            await outputChannel.send(`-\nLog complete! Sent at <t:${ts}>!\nLast ran on <t:${lastRun}>.\nHas been ran a total of ${timesRan+1} times.`);
        }
    }

    //Build new runtime array
    let newRuntimeArray = {};
    newRuntimeArray.lastRun = ts;
    newRuntimeArray.totalRuns = timesRan+1;

    //Overwrite old runtime array
    console.log('Writing new runtime array...');
    await fs.writeFileSync('./runtime.json', JSON.stringify(newRuntimeArray));

    //Output to console that execution is fully complete.
    console.log("And...finished!");

    //Terminate script
    //process.exit();

}

function loopRun(){
    console.log("\n\n\n\n!!!ACHTUNG!!! Running Garde Updates Function")
    scanForGradeUpdates();
    setTimeout(loopRun, 14400000);
}

async function start()
{
    const currentUser = await noblox.setCookie(TOKENS.robloxSecurityKey);

    // Output the current user's username
    console.log(`Logged in as ${currentUser.UserName}`);

    //Begin discord client bootup and login function
    //Login to discord using prior token
    await client.login(TOKENS.discordToken);

    //When client is ready, log that it's ready and proceed to main function
    client.once('ready', () => {
        console.log('Discord client ready!');
    });

    //Output discord username and verify login status
    console.log(`Logged into discord as ${client.user.username} and registering as ${client.user.presence.status}!`)

    // Scan for garde updates.
    await loopRun();

}

start();