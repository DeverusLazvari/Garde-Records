import Log from './Log.js';

async function sleep(ms) {
    return new Promise((resolve) => {
    setTimeout(resolve, ms);
    });
}
      
const errorFunctions = {};

async function tryUntilSucceed(promiseFn) {
    try {
        return await promiseFn();
    } catch (e) {
        await sleep(5000);
        Log.addLog(`[Errors] Error encounter, retrying. ${e}`);
        return tryUntilSucceed(promiseFn);
    }
}

Object.assign(errorFunctions, {
    tryUntilSucceed
})

export default errorFunctions;