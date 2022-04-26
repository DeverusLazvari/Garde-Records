import fs from 'fs';
// Create logs directory if it doesn't exist
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

function getTodaysFile() {// Replace the / in the date with -
    let fileName = new Date().toLocaleDateString().replace(/\//g, '-');
    return fileName;
}

const Log = {};

function addLog(log) {
    // Add timestamp with minutes and seconds
    log = `[${new Date().toLocaleTimeString()}] ${log}`;
    fs.appendFileSync(`./logs/${getTodaysFile()}`, `${log}\n`);
    //console.log(`${log}`);
}

Object.assign(Log, {
    addLog
});

export default Log;