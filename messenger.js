import EventEmitter from 'events';
import Database from "./Database.js";
import noblox from "noblox.js";
import User from "./User.js";
import Log from "./Log.js";
import errorFunctions from "./ErrorHandling.js";
import Discord from "./Discord.js";
import TOKENS from "./sensitive_business/tokens.js";

async function messageNewMembers() {

    //Get active client value
    const client = Discord.getClient();

    //Wait for client ready to proceed
    await client.once("ready", () => Log.addLog("[Recruitment] Recruitment Service ready to proceed."))

    //Get guild and track members joined, message new members.
    client.on('guildMemberAdd', member => {

        //Send welcome message
        member.send("Test!");

        //Log welcome message.
        Log.addLog(`[Recruitment] Sent recruitment message to ${member.user.username} from the Garde Imperiale Discord.`)
     }
    );

}

const RecruitmentService = {};

Object.assign(RecruitmentService, {
    messageNewMembers,
});

export default RecruitmentService;