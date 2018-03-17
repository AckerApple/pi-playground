var wpi = require('wiringpi-node')
var piFile = require('./pi-sample')

module.exports.pi = function(){
  return new piFile.Pi( wpi )
}