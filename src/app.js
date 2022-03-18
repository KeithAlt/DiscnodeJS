const discordJS = require("discord.js");
const commands = require(`./commands`);
const relay = require(`./relay`);
const config = require(`./config/config.json`);
const fs = require(`fs`);
const env = (fs.existsSync(`./config/process.env`) && require(`./config/process.env`)) || false;

const client = new discordJS.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const token = process.env.DISCORD_TOKEN;

console.log(`[${config.bot.name}] Discord Bot : Starting...`);

try {
	// Run a configuration check
	if (env && process.env.DISCORD_TOKEN != "PLACE_DISCORD_TOKEN_HERE") {
		console.log(`[${config.bot.name}] : Discord API token verified succesfully`);
	} else {
		// Setup our required config files if they don't exist
		if (!env) {
			fs.writeFile(`./config/process.env`, `process.env.DISCORD_TOKEN = "PLACE_DISCORD_TOKEN_HERE";\nprocess.env.EXPRESS_PORT = 80;`, function(err) {
				if (err) throw err;
				console.log(`[${config.bot.name}] : No process.env detected; created process.env file`);
			})
			throw "Please configure the newly created process.env with your Discord API key & restart this app.";
		}

		if (process.env.DISCORD_TOKEN == "PLACE_DISCORD_TOKEN_HERE") {
			throw "You have not configured the config/process.env file with your Discord API token!\n- Paste your token in the file & restart this app.";
		}
	}

	// Initialize our Discord bot
	client
	    // On ready event
	    .on("ready", () => {
	        console.log(`[${config.bot.name}] : Succesfully logged in as ${client.user.tag}`);
	        commands.initalize(discordJS, client);

			if (config.express.enabled === true) {
				relay.initalize(discordJS, client);
			}
	    })

	    // On message event
	    .on("messageCreate", msg => {
	        if (msg.content.startsWith(config.bot.cmdPrefix)) {
	            msg.content = msg.content.substring(1);
	            commands.handle(msg);
	        }
	    })
	.login(token);
} catch(error) {
	console.error(error);
}
