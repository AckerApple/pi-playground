var pi = require('./pi').pi()
var wpi = require('wiringpi-node')

const LedPinRed   = 27
const LedPinGreen = 28
const LedPinBlue  = 29

function ledInit(){
	wpi.softPwmCreate(LedPinRed,  0, 100)
	wpi.softPwmCreate(LedPinGreen,0, 100)
	wpi.softPwmCreate(LedPinBlue, 0, 100)
}

function ledColorSet(r_val, g_val, b_val){
	wpi.softPwmWrite(LedPinRed,   r_val);
	wpi.softPwmWrite(LedPinGreen, g_val);
	wpi.softPwmWrite(LedPinBlue,  b_val);
}

function promiseDelay(delay){
	return new Promise((res,rej)=>{
		setTimeout(()=>res(), delay)
	})
}

function main(){

	if(wpi.wiringPiSetup() == -1){ //when initialize wiring failed, console.log messageto screen
		console.log("setup wiringPi failed !");
		return 1; 
	}

	ledInit();

	console.log("\n");
	console.log("\n");
	console.log("========================================\n");
	console.log("|              Breath LED              |\n");
	console.log("|    ------------------------------    |\n");
	console.log("|       Red Pin connect to GPIO0       |\n");
	console.log("|      Green Pin connect to GPIO1      |\n");
	console.log("|       Blue Pin connect to GPIO2      |\n");
	console.log("|                                      |\n");
	console.log("|  Make a RGB LED emits various color  |\n");
	console.log("|                                      |\n");
	console.log("|                            SunFounder|\n");
	console.log("========================================\n");
	console.log("\n");
	console.log("\n");

	setInterval(()=>{
		Promise.resolve()
		.then(()=>{
			console.log("Red\n");
			ledColorSet(0xff,0x00,0x00);   //red	
		})
		.then( promiseDelay(500) )
		.then(()=>{
			console.log("Green\n");
			ledColorSet(0x00,0xff,0x00);   //green
		})
		.then( promiseDelay(500) )
		.then(()=>{
			console.log("Blue\n");
			ledColorSet(0x00,0x00,0xff);   //blue
		})
		.then( promiseDelay(500) )
		.then(()=>{
			console.log("Yellow\n");
			ledColorSet(0xff,0xff,0x00);   //yellow
		})
		.then( promiseDelay(500) )
		.then(()=>{
			console.log("Purple\n");
			ledColorSet(0xff,0x00,0xff);   //purple
		})
		.then( promiseDelay(500) )
		.then(()=>{
			console.log("Cyan\n");
			ledColorSet(0xc0,0xff,0x3e);   //cyan
		})
	},500)

	return 0;
}


main()