const config = require(`./config/config.json`);
let discord;
let client;

// Permmision check by name
function hasRole(member, requiredRole) {
  return member.roles.cache.some(role => role.name === requiredRole)
}

// Permmision check by admin priv
function isAdmin(msg, member) {
  return member.permissionsIn(msg.channelId).has("ADMINISTRATOR")
}

// Send a temporary message that will eventually explode
function replyMsgTimed(replyStr, msgObj, delay) {
  msgObj.reply(replyStr).then((replyMsgObj) => {setTimeout(function() {
      replyMsgObj.delete()
    }, (delay * 1000 || 10000))
  })
}

// Command registry
commands = {
  // Command has failed to run for invalid argumental reasons
  fail(cmdObj, msgObj) {
    replyMsgTimed(`This command requires at least ${cmdObj.reqArgLength} arguments for it's ${cmdObj.reqSyntax} syntax`, msgObj);
    return false
  },
    ["state"] : {
        hasPerm : function(msg, member) {
            return isAdmin(msg, member)
        },
        reqSyntax: `<command>`,
        reqArgLength: 0,
        func : function(msg, args) {
          replyMsgTimed(`We have been fully operational for - **${Math.round(process.uptime()/60)} minutes**`, msg, 15);
        }
    },
}

// "Useful" globals
module.exports = {
    initalize: function(discordObject, clientObject) {
        discord = discordObject;
        client = clientObject;
        console.log(`[${config.bot.name}] : Succesfully initalized commands`);

        return true;
    },

    handle: function(msg) {
        let args = msg.content.split(" ");

        if (commands[args[0]] && commands[args[0]].hasPerm(msg, msg.member)) {
            commands[args[0]].func(msg, args);
        }
    }
}
