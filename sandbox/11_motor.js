var pi = require('ack-pi').pi( require('os').platform()==='linux' )
var wpi = pi.driver
var op = new require('ack-pi/dist/OrdinalProcessor').op()

const MotorPin1   = 0
const MotorPin2   = 1
const MotorEnable = 2

function main(){
	/*
	if(wiringPiSetup() == -1){ //when initialize wiring failed, print messageto screen
		console.log("setup wiringPi failed !");
		return 1; 
	}
	*/
	
	const mp1 = pi.power(MotorPin1);
	const mp2 = pi.power(MotorPin2);
	const mpOn = pi.outputPin(MotorEnable);

	console.log("\n");
	console.log("\n");
	console.log("========================================\n");
	console.log("|                Motor                 |\n");
	console.log("|    ------------------------------    |\n");
	console.log("|     Motor pin 1 connect to GPIO0     |\n");
	console.log("|     Motor pin 2 connect to GPIO1     |\n");
	console.log("|     Motor enable connect to GPIO3    |\n");
	console.log("|                                      |\n");
	console.log("|         Controlling a motor          |\n");
	console.log("|                                      |\n");
	console.log("|                            SunFounder|\n");
	console.log("========================================\n");
	console.log("\n");
	console.log("\n");

	op
	.then(()=>{
		console.log("Clockwise\n");
		mpOn.high();
		mp1.off();
		mp2.on();
	})
	.delay(3000)
	.then(()=>{
		console.log("Stop\n");
		mpOn.low();
	})
	.delay(3000)
	.then(()=>{
		console.log("Anti-clockwise\n");
		mpOn.high();
		mp1.on();
		mp2.off();
	})
	.delay(3000)
	.then(()=>{
		console.log("Stop\n");
		mpOn.low();
	})
	.delay(3000)
	.rerun()
}

main()