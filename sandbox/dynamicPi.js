if( process.argv.indexOf('--test')>=0 ){
	console.log('--- TEST MODE ---')
	var pi = require('./pi-sample').pi
}else{
	var pi = require('./pi').pi
}

module.exports.pi = function(){
	return pi()
}

