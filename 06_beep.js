var pi = require('./dynamicPi').pi()
var wpi = pi.driver
var op = new require('./OrdinalProcessor').op()

const BeepPin = 2

var buzzer = pi.buzzer( BeepPin )

function main(){
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
		buzzer.on(wpi.LOW);
	})
	.delay(100)
	.then(()=>{
		console.log("Buzzer off\n")
		//beep off
		buzzer.off(wpi.HIGH);		
	})
	.delay(100)
	.rerun()

	return 0
}

main()