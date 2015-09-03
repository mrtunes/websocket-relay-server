var express = require("express"),
    WebSocket = require("ws"),
    config = require(__dirname + "/config.json");

var appResources = config.webRoot.indexOf("/") === 0 ? config.webRoot : __dirname + "/" + config.webRoot,
    app = express(),
    server = app.listen(config.port),
    wss = new WebSocket.Server({
        server: server
    });



app.use("/", express.static(appResources));
console.log("Server listening on port " + config.port);



var allConnectedSockets = [];

wss.on("connection", function (socket) {
    allConnectedSockets.push(socket);
    socket.on("message", function (data) {
            allConnectedSockets.forEach(function (someSocket) {
            if (someSocket !== socket) {
                someSocket.send(data);


            }


        });
    });

    var clientMessages = {};

socket.on("message", function (data) {
  var parsed = JSON.parse(data);

    if (parsed.type === "join") {
        // A new client has joined.
        // First, send them all the changes for all the current synths that are in the chat.
         var jsonstringy = JSON.stringify({ type: "history", value: clientMessages});
         socket.send(jsonstringy);


        // Now create a new record to store all changes sent to this synth.
       clientMessages[parsed.id] = [parsed];
       console.log(clientMessages);
    } else if (parsed.type === "leave") {
        delete clientMessages[parsed.id];
    } else {
    clientMessages[parsed.id].push(parsed);
    }
});


    socket.on("close", function () {
      console.log("closer");
        var idx = allConnectedSockets.indexOf(socket);
        allConnectedSockets.splice(idx, 1);

    });
});
