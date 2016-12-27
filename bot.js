//Testeando
var token = '313870588:AAEnpwGyGz8MbxzMrdDG3QnjEWZgWAUfp-I';

var request = require("request");
var url = "https://www.windowsazurestatus.com/odata/ServiceCurrentIncidents" +
    "?api-version=1.0";
var Bot = require('node-telegram-bot-api'),
    bot = new Bot(token, {
        polling: true
    });

console.log('bot server started...');

bot.onText(/^\/status/, function(msg, match) {
    var resp = ""
    request({
        url: url,
        json: true
    }, function(error, response, body) {

        var ret = "";
        if (!error && response.statusCode === 200) {
            var i = 0;
            var value = body.value;
            var error = false;

            for (i = 0; i < value.length; i++) {
                var service = value[i];
                var serviceName = service.Name;
                var regions = service.Regions
                var j = 0;

                for (j = 0; j < regions.length; j++) {
                    if (regions[j].Status != "Green") {
                        var error = true
                        var region = regions[j];
                        ret += serviceName + " @ " + region + ": ";
                        var k = 0;
                        var incidents = region.Incidents;

                        for (k = 0; k < incidents.length; k++) {
                            ret += 'There is an error.\n' //Falta veure la incidencia.
                        }
                    }
                }
                //ret += serviceName + " " + service.Status + "\n";
            }
            if (error == false) {
                ret += "All services are correct. More info at https://azure.microsoft.com/en-us/status/";
            }
        } else {
            ret = "Please, try again. If error persists send an email to sasensio@innovadag.com or visit https://azure.microsoft.com/en-us/status/";
        }

        bot.sendMessage(msg.chat.id, ret).then(function(sended) {
            // `sended` is the sent message.
        });
    });
});
