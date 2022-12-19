import EventEmitter from 'events';
import Database from "./Database.js";
import noblox from "noblox.js";
import User from "./User.js";
import Log from "./Log.js";
import errorFunctions from "./ErrorHandling.js";
import Discord from "./Discord.js";
import TOKENS from "./sensitive_business/tokens.js";
import RecruitmentService from "./messenger.js";
import Roblox from "./Roblox.js"

//await errorFunctions.sleep(120000)

async function loopRun(){
    
     await Discord.login();

    const client = Discord.getClient();
    await client.once("ready", () => Log.addLog("[Main] Functions proceeding."));

    RecruitmentService.messageNewMembers();

    await Database.fetchData();
    
    await Roblox.ScanForChanges();
    
    await Database.saveData();

    setTimeout(loopRun, 14400000);
}

loopRun();