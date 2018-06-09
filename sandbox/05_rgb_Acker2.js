var pi = require('ack-pi').pi( require('os').platform()==='linux' )
var wpi = pi.driver
var OrdinalProcessor = require('ack-pi/dist/OrdinalProcessor').OrdinalProcessor

const ledPinRed   = 27
const ledPinGreen = 28
const ledPinBlue  = 29

const LedPinRed   = pi.led( ledPinRed ).off()
const LedPinGreen = pi.led( ledPinGreen ).off()
const LedPinBlue  = pi.led( ledPinBlue ).off()

function ledColorSet(r_val, g_val, b_val){
	LedPinRed.softPwmWrite( r_val )
	LedPinGreen.softPwmWrite( g_val )
	LedPinBlue.softPwmWrite( b_val )
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

op.colorFeed({
	lighting : true,
	r_val:0,
	g_val:0,
	b_val:0
})
.delay(10)
.rerun()