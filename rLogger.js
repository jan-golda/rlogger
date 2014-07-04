var colors	= require('colors');
var fs		= require('fs');

var levels = {
	dump:	0,
	dev:	10,
	meta:	15,
	info:	20,
	warn:	30,
	error:	40
};

function Logger(options){
	//logging
	var logger = this;
	
	this.getTime = function(date){
		if(!date)date = new Date();
		var Y	= date.getFullYear().toString().substring(2);
		var M	= date.getMonth()+1;
		var D	= date.getDate();
		var h	= date.getHours();
		var m	= date.getMinutes();
		var s	= date.getSeconds();
		return Y+"."+(M<10?"0"+M:M)+"."+(D<10?"0"+D:D)+" "+(h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
	};
	this.write = function(msg){
		console.log(msg);
		
		if(options.file)fs.appendFileSync(options.file, msg.replace(/\x1b[[^0-9]*m/g, '')+"\n");
	};
	this.log = function(prefix,msg,par,meta){
		msg = msg+"";
		if(par){
			msg = msg.replace(/{(\d+)}/g, function(match, number) {
				return (typeof par[number] != 'undefined' ? par[number] : match);
			});
		}
		msg = msg.replace(/&([^&]*)&/g, function(match, text) {
			return text.magenta;
		});
		
		this.write(this.getTime().blackBG.white+" "+prefix+" "+msg);
		
		if(this.level<=15 && meta) this.write(this.getTime().blackBG.white+" "+"[META]".blackBG.grey+" \t"+JSON.stringify(meta).grey);
	};
	this.error = function(msg,par,meta,err){
		if(this.level<=40) this.log("[ERR!]".redBG.black,msg,par,meta);
		//if(err)this.write(err.toString());
	};
	this.warn = function(msg,par,meta){
		if(this.level<=30) this.log("[WARN]".yellowBG.black,msg,par,meta);
	};
	this.info = function(msg,par,meta){
		if(this.level<=20) this.log("[INFO]".blackBG.green,msg,par,meta);
	};
	this.dev = function(msg,par,meta){
		if(this.level<=10) this.log("[ DEV]".blackBG.grey,msg,par,meta);
	};
	this.dump = function(meta){
		if(this.level<=0)  this.write(this.getTime().blackBG.white+" "+"[DUMP]".blackBG.grey+" "+JSON.stringify(meta).grey);
	};
	//level (dump <=0, dev <=10, meta <=15, info <=20, warn <=30, error <=40)
	this.setLevel = function(lvl){
		options.level = lvl;
		if(typeof options.level === 'number'){
			this.level = options.level;
		}else{
			var l = levels[options.level];
			if(typeof l === 'undefined'){
				this.level = 20;
			}else{
				this.level = l;
			}
		}
	}
	
	
	//level
	if(!options.level)options.level = "info";
	this.setLevel(options.level);
	
	//file
	if(options.file)fs.appendFileSync(options.file, "\n\n========================================\n Start\n========================================\n");
	
	//express.js
	this._express = function(prefix){
		if(prefix){
			prefix = prefix+" ";
		}else{
			prefix = "";
		}
		return function(req, res, next){
			var end = res.end;
			res.end = function(chunk, encoding) {
				
				res.end = end;
				res.end(chunk, encoding);
				
				if(res.statusCode >= 500){
					logger.error(prefix+"&{0}& "+"{1}".red+" {2}".grey, [req.method, res.statusCode, req.url]);
				}else if(res.statusCode >= 400){
					logger.warn(prefix+"&{0}& "+"{1}".yellow+" {2}".grey, [req.method, res.statusCode, req.url]);
				}else{
					logger.dev(prefix+"&{0}& "+"{1}".green+" {2}".grey, [req.method, res.statusCode, req.url]);
				}    
			};
			next();
		};
	};
}

module.exports = function(options){
	if(!options) options={};
	return new Logger(options);
};