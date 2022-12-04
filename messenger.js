import EventEmitter from 'events';
import Database from "./Database.js";
import noblox from "noblox.js";
import User from "./User.js";
import Log from "./Log.js";
import errorFunctions from "./ErrorHandling.js";
import Discord from "./Discord.js";
import TOKENS from "./sensitive_business/tokens.js";

//Check discord login status
if(await Discord.loginStatus() == true){
    await Discord.sendMessage(channelId,outputMessage);
}
else{
    await Discord.login();
    await Discord.sendMessage(channelId,outputMessage);
}

//Get active client value
const client = Discord.getClient();

//Get guild and track members joined
client.on('guildMemberAdd', member => {
       const sendChannelId = member.dmChannel.id;
       Discord.sendMessage(sendChannelId,"Test");
    }
)