var pi = require('./dynamicPi').pi()
var wpi = pi.driver
var op = new require('./OrdinalProcessor').op()

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
	
	wpi.pinMode(MotorPin1, wpi.OUTPUT);
	wpi.pinMode(MotorPin2, wpi.OUTPUT);
	wpi.pinMode(MotorEnable, wpi.OUTPUT);

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
		wpi.digitalWrite(MotorEnable, wpi.HIGH);
		wpi.digitalWrite(MotorPin1, wpi.HIGH);
		wpi.digitalWrite(MotorPin2, wpi.LOW);
	})
	.delay(3000)
	.then(()=>{
		console.log("Stop\n");
		wpi.digitalWrite(MotorEnable, wpi.LOW);
	})
	.delay(3000)
	.then(()=>{
		console.log("Anti-clockwise\n");
		wpi.digitalWrite(MotorEnable, wpi.HIGH);
		wpi.digitalWrite(MotorPin1, wpi.LOW);
		wpi.digitalWrite(MotorPin2, wpi.HIGH);
	})
	.delay(3000)
	.then(()=>{
		console.log("Stop\n");
		wpi.digitalWrite(MotorEnable, wpi.LOW);
	})
	.delay(3000)
	.rerun()
}

main()