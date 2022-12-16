import EventEmitter from 'events';
import Database from "./Database.js";
import noblox from "noblox.js";
import User from "./User.js";
import Log from "./Log.js";
import errorFunctions from "./ErrorHandling.js";
import Discord from "./Discord.js";
import TOKENS from "./sensitive_business/tokens.js";

//Declare image assets
import {MessageAttachment} from 'discord.js'
const firstImage = new MessageAttachment("images/RecruitmentMessage1.png");
const secondImage = new MessageAttachment("images/RecruitmentMessage2.png");
const thirdImage = new MessageAttachment("images/RecruitmentMessage3.png");

async function messageNewMembers() {

    //Get active client value
    const client = Discord.getClient();

    //Wait for client ready to proceed
    await client.once("ready", () => Log.addLog("[Recruitment] Recruitment Service ready to proceed."))

    //Get guild and track members joined, message new members.
    client.on('guildMemberAdd', member => {

        //Send welcome message
        member.send({files: [firstImage]});
        member.send("> Hello, and welcome to the discord server and home of the best and most capable fighting force in the Napoleonic Wars, the **Garde Impériale**!\n> \n> The Garde is a unique fighting force that prides itself in upholding tradition while maintaining a strict standard of competence and capability, where only the best continue to move forward and achieve the Garde's highest honours!");
        member.send({files: [secondImage]});
        member.send("> As a member of the Garde, you can expect a fresh beginning where your perseverance and ambitions to move on are recognized and valued, with ample opportunity for advancement!\n> \n> Above all, however, the Garde Impériale is a tight-knit community where every member is valued as a part of our brotherhood, where community events are hosted frequently and during off-hours there are plenty of folks to talk to!");
        member.send({files: [thirdImage]});
        member.send("> If you find yourself up for the task, and think you're up to the challenge, look no further! Head down to <#964636410692927518> and make your mark!\n> \n> <:marcus:893869808121159722>")

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