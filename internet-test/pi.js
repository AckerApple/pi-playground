//pi
const pi = require('../sandbox/dynamicPi').pi()
const ordinalProcessor = require('../sandbox/OrdinalProcessor').op
const LedPin = pi.outputPin(0)

const op = ordinalProcessor()

op.createFeed("ledOn", function(sets){
  console.log('led on')
  LedPin.on()
})

op.createFeed("ledOff", function(sets){
  console.log('led off')
  LedPin.off()
})

const InternetTest = require('./InternetTest').InternetTest
const internetTest = new InternetTest()

op
.ledOn()
.delay(100)
.ledOff()
.delay(100)
.ledOn()
.delay(100)
.ledOff()