import {Client, Intents} from 'discord.js'
import TOKENS from './sensitive_business/tokens.js'
import Log from './Log.js'
const client = new Client({intents:[Intents.FLAGS.GUILDS]});

async function login(){ //Login to discord bot using the provided credentials
    let credentials = TOKENS.discordToken;
    await client.login(credentials);

    Log.addLog(`[Discord] Logged into client ${client.user.username}`);
}

async function destroy(){   //Destroys the client, terminating its connection
    await client.destroy();

    Log.addLog(`[Discord] Destroyed client`);
}

async function sendMessage(channelId,messageToSend){  //Send message to provided channel Id.
    const channelToSend = await client.channels.fetch(channelId);
    await Log.addLog(`[Discord] Created channel object ${channelToSend.name}`);
    await channelToSend.send(messageToSend);
}

const Discord = {};

Object.assign(Discord, {
    login,
    destroy,
    sendMessage,
});