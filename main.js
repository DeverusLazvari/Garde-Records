import Database from "./Database.js";
import Roblox from "./Roblox.js";
import Discord from "./Discord.js";
import errorFunctions from "./ErrorHandling.js";

//await errorFunctions.sleep(120000)

async function loopRun(){
    await errorFunctions.tryUntilSucceed(() => Discord.login());

    await Database.fetchData();
    
    await Roblox.ScanForChanges();
    
    await Database.saveData();

    setTimeout(loopRun, 14400000);
}

loopRun();