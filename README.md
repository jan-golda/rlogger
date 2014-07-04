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
If you want rlogger to log http requests you have to put somewhere this piece code: 
```js
app.use(logger._express);
```