var express = require("express");

var server = express();

//logger
var rlogger = require('./rlogger2')({
	file: 'logger.log',
	level: 'dump'
});
GLOBAL.logger = rlogger.getLogger("[ADMIN]".grey);

//configuration
server.set("port", 80);
server.use(rlogger.getExpress("[HTTP]".grey));

//routes
server.get("/error", function(req,res,next){
    res.status(500);
    res.end("Error printed to console!");
    logger.error("Error requested from &{0}&", [req.ip]);
});
server.get("/warn", function(req,res,next){
    res.status(400);
    res.end("Warning printed to console!");
    logger.warn("Warning requested from &{0}&", [req.ip]);
});
server.get("/info", function(req,res,next){
    res.end("Info printed to console!");
    logger.info("Info requested from &{0}&", [req.ip]);
    next();
});
server.get("/dev", function(req,res,next){
    res.end("Dev message printed to console!");
    logger.dev("Dev message requested from &{0}&", [req.ip]);
});
server.get("/dump", function(req,res,next){
    res.end("Object printed to console!");
    logger.dump({message: "Object printed to console", ip: req.ip});
});

server.listen(server.get("port"));
logger.info("Express server listening on port &{0}&", [server.get("port")]);