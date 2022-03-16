const discordJS = require("discord.js");
const commands = require(`./commands`);
const relay = require(`./relay`);
const config = require(`./config/config.json`);

const client = new discordJS.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const token = config.discord.token

console.log(`[${config.bot.name}] Discord Bot : Starting...`);

client
    // On ready event
    .on("ready", () => {
        console.log(`[${config.bot.name}] : Succesfully logged in as ${client.user.tag}`);
        commands.initalize(discordJS, client);
        relay.initalize(discordJS, client);
    })

    // On message event
    .on("messageCreate", msg => {
        if (msg.content.startsWith(config.bot.cmdPrefix)) {
            msg.content = msg.content.substring(1);
            commands.handle(msg);
        }
    })

// Login our client to the Discord server(s)
.login(token);
