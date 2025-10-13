"use strict"
var http = require("http");
fs = require("fs");

http.createServer(function(req, res){
    fs.readFile("./index.html", function(err, files){
        var files_string = files.toString()

        res.writeHead(200, {"Content-Type": "text/html"})
        res.write(files)
        res.end();
    })
}).listen(8080)




