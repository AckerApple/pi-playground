var pi = require('./dynamicPi').pi()
var wpi = pi.driver
var op = new require('./OrdinalProcessor').op()

const BeepPin = 2

function main(){
	if(wpi.wiringPiSetup() == -1){ //when initialize wiring failed, print messageto screen
		console.log("setup wiringPi failed !")
		return 1
	}
	
	wpi.pinMode(BeepPin, wpi.OUTPUT);   //set GPIO0 output

	console.log("\n")
	console.log("\n")
	console.log("========================================\n")
	console.log("|                 Beep                 |\n")
	console.log("|    ------------------------------    |\n")
	console.log("|        Buzzer connect to GPIO0       |\n")
	console.log("|                                      |\n")
	console.log("|            Make Buzzer beep          |\n")
	console.log("|                                      |\n")
	console.log("|                            SunFounder|\n")
	console.log("========================================\n")
	console.log("\n")
	console.log("\n")

	op
	.then(()=>{
		//beep on
		console.log("Buzzer on\n")
		wpi.digitalWrite(BeepPin, wpi.LOW);
	})
	.delay(100)
	.then(()=>{
		console.log("Buzzer off\n")
		//beep off
		wpi.digitalWrite(BeepPin, wpi.HIGH);		
	})
	.delay(100)
	.rerun()

	return 0
}

main()