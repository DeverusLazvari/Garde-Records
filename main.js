import Database from "./Database.js";
import Roblox from "./Roblox.js";
import Discord from "./Discord.js";

async function loopRun(){
    await Discord.login();

    await Database.fetchData();
    
    await Roblox.ScanForChanges();
    
    await Database.saveData();

    setTimeout(loopRun, 14400000);
}

loopRun();