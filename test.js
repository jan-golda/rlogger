GLOBAL.logger = require('./rLogger')({file: "test.log", level: "dump"});

logger.error	("In &porta& {0} eget porta rutrum. {1} &et& tincidunt felis.", ["leo","Proin"], {foo: "bar"});
logger.warn	("In &porta& {0} eget porta rutrum. {1} &et& tincidunt felis.", ["leo","Proin"]);
logger.info	("In &porta& {0} eget porta rutrum. {1} &et& tincidunt felis.", ["leo","Proin"]);
logger.dev	("In &porta& {0} eget porta rutrum. {1} &et& tincidunt felis.", ["leo","Proin"]);
logger.dump	({foo: "bar"});