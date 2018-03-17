var pi = require('./dynamicPi').pi()
var wpi = pi.driver
var OrdinalProcessor = require('./OrdinalProcessor').OrdinalProcessor

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

const op = new OrdinalProcessor()

op.createFeed("colorFeed", function(sets){
	const rHigh = sets.r_val===255
	const gHigh = sets.g_val===255
	const bHigh = sets.b_val===255
	const rLow = sets.r_val===0
	const gLow = sets.g_val===0
	const bLow = sets.b_val===0

	if( rHigh && gHigh &&  bHigh ){
		sets.lighting = false
	}else if( rLow && gLow && bLow ){
		sets.lighting = true
	}

	if( sets.lighting ){
		if(gHigh){
			++sets.b_val
		}else if( rHigh ){
			++sets.g_val
		}else{
			++sets.r_val
		}
	}else{
		if(gLow){
			--sets.b_val
		}else if( rLow ){
			--sets.g_val
		}else{
			--sets.r_val
		}		
	}
	console.log(sets.r_val, sets.g_val, sets.b_val)
	ledColorSet(sets.r_val, sets.g_val, sets.b_val)
	return sets
})

if(wpi.wiringPiSetup() == -1){ //when initialize wiring failed, console.log messageto screen
	console.log("setup wiringPi failed !");
	return 1; 
}

ledInit();


op.colorFeed({
	lighting : true,
	r_val:0,
	g_val:0,
	b_val:0
})
.delay(10)
.rerun()