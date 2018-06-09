/**********************************************************************
* Filename    : blinkLed.c
* Description : Make an led blinking.
* Author      : Robot
* E-mail      : support@sunfounder.com
* website     : www.sunfounder.com
* Update      : Cavon    2016/07/01
**********************************************************************/

//var wpi = require('wiring-pi');
var pi = require('ack-pi').pi( require('os').platform()==='linux' )


const LedPin = 0

function main(){
  let isOn = false
	// When initialize wiring failed, print messageto screen
	/*if(wpi.wiringPiSetup() == -1){
		console.log("setup wiringPi failed !");
		return 1; 
	}*/
	
	const led = pi.led( LedPin );

	console.log("\n");
	console.log("\n");
	console.log("========================================\n");
	console.log("|              Blink LED               |\n");
	console.log("|    ------------------------------    |\n");
	console.log("|         LED connect to GPIO0         |\n");
	console.log("|                                      |\n");
	console.log("|        LED will Blink at 500ms       |\n");
	console.log("|                                      |\n");
	console.log("|                            SunFounder|\n");
	console.log("========================================");
	console.log("\n");
	console.log("\n");

	setInterval(()=>{
		if( isOn=!isOn ){
			// LED on
			led.low()
			console.log("...LED on\n")
		}else{
			// LED off
			led.high()
			console.log("LED off...\n")
		}
	},100)

	return 0;
}

main()
