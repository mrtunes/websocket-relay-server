var express = require("express"),
    WebSocket = require("ws"),
    config = require(__dirname + "/config.json");

var appResources = config.webRoot.indexOf("/") === 0 ? config.webRoot : __dirname + "/" + config.webRoot,
    app = express(),
    server = app.listen(config.port),
    wss = new WebSocket.Server({
        server: server
    });
var clientMessages = [];
   

app.use("/", express.static(appResources));
console.log("Server listening on port " + config.port);



var allConnectedSockets = [];

wss.on("connection", function (socket) {
    allConnectedSockets.push(socket);

  

    socket.on("message", function (data) {
         console.log(data);
        allConnectedSockets.forEach(function (someSocket) {
            if (someSocket !== socket) {
                someSocket.send(data);
                //is this where data gets printed out?             
               
            }


        });
    });


       socket.on("message", function (data) {

        var joinMessages = {"history":clientMessages};     
        var jsonstring = JSON.stringify(joinMessages); 
     if (data.type === "join") {
        console.log("hello" + jsonstring);
        socket.send(jsonstring);

           
  
  }

    });



    socket.on("close", function () {
        var idx = allConnectedSockets.indexOf(socket);
        allConnectedSockets.splice(idx, 1);
    });
});
