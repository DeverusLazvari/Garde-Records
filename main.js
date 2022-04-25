import Database from "./Database.js";
import Roblox from "./Roblox.js";

await Database.fetchData();

await Roblox.ScanForChanges();

await Database.saveData();