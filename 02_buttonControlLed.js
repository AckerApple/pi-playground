var pi = require('./pi').pi()
var wpi = require('wiringpi-node')
var open = require("open");

const LedPin    = 0
const ButtonPin = 1

const ledPin = pi.led(LedPin)
const btnPin = pi.btnPin(ButtonPin)

function main(){
  initStandBy()
}

function initStandBy(){
  //ledPin.blink(200)
  ledPin.breath(20,1000)

  const btnWatch = btnPin.watch()
  .pressed(()=>{
	ledPin.off()
    console.log('Here  we     go ...')
  })
  .released(()=>{
	btnWatch.stop()
	startApp()
	console.log('the ack app has begun. Push the button')
  })

  console.log('Please push your Acker button to begin')
}

function startApp(){
	btnPin
	.watch()
	.pressed(()=>{
	  console.log('Ready for google?')
	  ledPin.blink(500)
	})
	.released(()=>{
		ledPin.off()
		open("http://www.google.com");
		console.log('opening google, please wait...')
	})
}

process.once('SIGINT',()=>{
	console.log('exiting program....')
	ledPin.off()
	process.exit()
})

main()
