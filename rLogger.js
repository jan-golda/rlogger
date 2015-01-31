var fs 		= require('fs');
var colors	= require('colors');

var levels = {
	dump:	0,
	dev:	10,
	meta:	15,
	info:	20,
	warn:	30,
	error:	40
};

function getTime(date) {
	date = date || new Date();

	var Y	= date.getFullYear().toString().substring(2);
	var M	= date.getMonth()+1;
	var D	= date.getDate();
	var h	= date.getHours();
	var m	= date.getMinutes();
	var s	= date.getSeconds();

	return Y+"."+(M<10?"0"+M:M)+"."+(D<10?"0"+D:D)+" "+(h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
};

function rLogger(options) {
	var logger = this;

	//writing message to console and file
	logger.write = function write(msg) {

		//write message to console
		console.log(msg);

		//write message to file with out color codes
		if(logger.options.file)
			fs.appendFileSync(logger.options.file, msg.replace(/\x1b[[^0-9]*m/g, '')+"\n");
	};

	//setting logging level
	logger.setLevel = function setLevel(lvl) {
		if(typeof lvl === 'number'){
			logger.options.level = lvl;
		}else if(typeof lvl === 'string'){
			logger.setLevel(levels[lvl]);
		}
	};

	//options
	logger.options = options || {};
	logger.setLevel(logger.options.level);
	if(typeof logger.options.level === 'undefined')
		logger.options.level = levels['info'];

	//file
	if(options.file)
		fs.appendFileSync(options.file, "\n\n========================================\n Start\n========================================\n");

	//logger
	logger.getLogger = function getLogger(prefix) {
		return new (function Logger(){
			prefix = prefix || '';
			//private, just log, without level
			function log(level, msg, par, meta) {
				msg = ''+msg;

				//change {0},{1},{3}... to params
				if(par){
					msg = msg.replace(/{(\d+)}/g, function(match, number) {
						return (typeof par[number] != 'undefined' ? par[number] : match);
					});
				}

				//change &...& to color codes
				msg = msg.replace(/&([^&]*)&/g, function(match, text) {
					return text.magenta;
				});

				//write message
				logger.write(getTime().blackBG.white+" "+level+" "+prefix+" "+msg);

				//write meta
				if(logger.options.level<=levels['dump'] && meta)
					logger.write(getTime().blackBG.white+" "+"[META]".blackBG.grey+" "+prefix+" "+JSON.stringify(meta).grey);
			};

			this.error = function(msg,par,meta){
				if(logger.options.level<=levels['error'])
					log("[ERR!]".redBG.black, msg, par, meta);
			};
			this.warn = function(msg,par,meta){
				if(logger.options.level<=levels['warn'])
					log("[WARN]".yellowBG.black, msg, par, meta);
			};
			this.info = function(msg,par,meta){
				if(logger.options.level<=levels['info'])
					log("[INFO]".blackBG.green, msg, par, meta);
			};
			this.dev = function(msg,par,meta){
				if(logger.options.level<=levels['dev'])
					log("[ DEV]".blackBG.grey, msg, par, meta);
			};
			this.dump = function(meta){
				if(logger.options.level<=levels['dump'])
					log("[DUMP]".blackBG.grey, JSON.stringify(meta).grey);
			};
		})();
	};

	logger.getExpress = function getExpress(prefix) {
		var l = logger.getLogger(prefix);

		return function(req, res, next){
			var end = res.end;
			res.end = function(chunk, encoding) {
				
				res.end = end;
				res.end(chunk, encoding);
				
				if(res.statusCode >= 500){
					l.error("&{0}& "+"{1}".red+" {2}".grey, [req.method, res.statusCode, req.url]);
				}else if(res.statusCode >= 400){
					l.warn("&{0}& "+"{1}".yellow+" {2}".grey, [req.method, res.statusCode, req.url]);
				}else{
					l.dev("&{0}& "+"{1}".green+" {2}".grey, [req.method, res.statusCode, req.url]);
				}    
			};
			next();
		};
	}
}

module.exports = function(options) {
	return new rLogger(options);
};
