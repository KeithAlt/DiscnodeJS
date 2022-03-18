var express = require(`express`);
var bodyParser = require(`body-parser`);
var cookieParser = require(`cookie-parser`);
const config = require(`./config/config.json`);
const fs = require(`fs`);
const env = (fs.existsSync(`./config/process.env`) && require(`./config/process.env`)) || false;

module.exports = {
    initalize: function(discordObject, clientObject) {
        discord = discordObject;
        client = clientObject;
        console.log(`[${config.bot.name}] Express : Succesfully initalized express`);
        return true;
    }
}

if (config.express.enabled === false) {
  console.log(`[${config.bot.name}] Express: Halting initalization of server\n(disabled in config)`)
  return;
}

try {
	var app = express();
	const port = process.env.EXPRESS_PORT;

	app
	    .use(cookieParser())
	    .use(bodyParser.json())
	    .use(bodyParser.urlencoded({ extended: true }))

	    // On repo merge webhook call event
	    .post(`/hook_event`, function(req, res) {
	        res.sendStatus(200);
	    })

	    // On error event
	    .on(`uncaughtException`, function(err) {
	        console.log(err);
	    })

	.listen(port, () => console.log(`[${config.bot.name}] Express : Web server online @ port: ${port}`));
} catch(error) {
	console.error(error);
}
