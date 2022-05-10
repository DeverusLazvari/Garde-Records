import Log from './Log.js';

class errorFunctions {

    async sleep(ms) {
        return new Promise((resolve) => {
        setTimeout(resolve, ms);
        });
    }
      
    async tryUntilSucceed(promiseFn) {
        try {
            return await promiseFn();
        } catch (e) {
            await sleep(5000);
            Log.addLog(`[Errors] Error encounter, retrying. ${e}`);
            return tryUntilSucceed(promiseFn);
        }
    }

}

export default new errorFunctions('.');