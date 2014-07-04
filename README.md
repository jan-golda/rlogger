rLogger
=======

Very simple, nice-looking logger.

## Installation
```bash
npm install rlogger
```
## Usage
### Setting up
To set up rLogger you have to use one of these methods:
```js
//local logger
var logger = require("rlogger")(options);
//global logger
GLOBAL.logger = require("rlogger")(options);
```
Options object:
```js
var options = {
  //file to save log to (default: none)
  file: "server.log",
  //level of logging (default: "info") (possible values: "dump" <=0, "dev" <=10, "meta" <=15, "info" <=20, "warn" <=30, "error" <=40)
  level: "info"
}
```
### Logging levels
* "__dump__"
  * 0 | Displays everything
* "__dev__"
  * 10 | Displays everything except dump messages
* "__meta__"
  * 15 | Displays info, warnings and errors with additional data
* "__info__"
  * 20 | Default, displays only info, warnings and error
* "__warn__"
  * 30 | Displays only warnings and errors
* "__error__"
  * 40 | Displays only errors

You can change level of logging using:
```js
logger.setLevel(level);
```
### Logging
```js
logger.error(message,[parameters], [meta]);
logger.warn(message,[parameters], [meta]);
logger.info(message,[parameters], [meta]);
logger.dev(message,[parameters], [meta]);
logger.dump(data);
```
* __message__ - (String, required) message to log
  * Can contains {_index_} - will be replace with data form __parameters__ at given index
  * Can contains &_text_& - text between will be colorized to highlight the most important informations
* __parameters__ - (Array, optional) - contains data that will be place instead of {_index_}
* __meta__ - (Object, optional) additional data that will be displayed after message
* __data__ - (Object, required) data to display

### Express.js middleware
If you want rlogger to log http requests you have to put somewhere this piece of code: 
```js
app.use(logger._express);
```

## Example
```js
var express = require("express");

var server = express();

//configuration
server.set("port", 80);
GLOBAL.logger = require("rlogger")({
	file: "server.log",
	level: "dump"
});
server.use(logger._express);

//routes
server.get("/error", function(req,res){
	res.status(500);
	res.end("Error printed to console!");
	logger.error("Error requested from &{0}&", [req.ip]);
});
server.get("/warn", function(req,res){
	res.status(400);
	res.end("Warning printed to console!");
	logger.warn("Warning requested from &{0}&", [req.ip]);
});
server.get("/info", function(req,res){
	res.end("Info printed to console!");
	logger.info("Info requested from &{0}&", [req.ip]);
});
server.get("/dev", function(req,res){
	res.end("Dev message printed to console!");
	logger.dev("Dev message requested from &{0}&", [req.ip]);
});
server.get("/dump", function(req,res){
	res.end("Object printed to console!");
	logger.dump({message: "Object printed to console", ip: req.ip});
});

server.listen(server.get("port"));
logger.info("Express server listening on port &{0}&", [server.get("port")]);
```