const config = require(`./config/config.json`);

if (!config.express.enabled) {
  console.log(`[${config.bot.name}] Express: Halting initalization of server\n(disabled in config)`)
  return;
}

var express = require(`express`);
var bodyParser = require(`body-parser`);
var cookieParser = require(`cookie-parser`);

var app = express();
const port = config.express.port;

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

.listen(port, () => console.log(`[${config.bot.name}] Express : Node server online @ port: ${port}`));

module.exports = {
    initalize: function(discordObject, clientObject) {
        discord = discordObject;
        client = clientObject;
        console.log(`${discord.bot.name} Express : Succesfully initalized express`);

        return true;
    }
}
