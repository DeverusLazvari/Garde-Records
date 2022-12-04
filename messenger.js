import EventEmitter from 'events';
import Database from "./Database.js";
import noblox from "noblox.js";
import User from "./User.js";
import Log from "./Log.js";
import errorFunctions from "./ErrorHandling.js";
import Discord from "./Discord.js";
import TOKENS from "./sensitive_business/tokens.js";

async function messageNewMembers() {

    //Check discord login status
    if(await Discord.loginStatus() == false){
        await Discord.login();
    }

    //Get active client value
    const client = Discord.getClient();

    console.log(client.user.username);

    //Get guild and track members joined, message new members.
    client.on('guildMemberAdd', member => {
        console.log("Member joined.");

        member.send("Test!");
     }
    );

}

const RecruitmentService = {};

Object.assign(RecruitmentService, {
    messageNewMembers,
});

export default RecruitmentService;