var pi = require('ack-pi').pi( require('os').platform()==='linux' )
var wpi = pi.driver
var op = new require('ack-pi/dist/OrdinalProcessor').op()

const RelayPin = 0
const LedPin = 1

function main(){
  /*
  if(wiringPiSetup() == -1){ //when initialize wiring failed, print messageto screen
    console.log("setup wiringPi failed !");
    return 1;
  }
  */
  
  const led = pi.led(LedPin);   //set GPIO0 output
  const relay = pi.relay(RelayPin);   //set GPIO0 output
  
  console.log("\n");
  console.log("\n");
  console.log("========================================\n");
  console.log("|                 Relay                |\n");
  console.log("|    ------------------------------    |\n");
  console.log("| GPIO0 connect to relay's control pin |\n");
  console.log("| led connect to relay's NormalOpen pin|\n");
  console.log("|  5v connect to relay's com pin       |\n");
  console.log("|                                      |\n");
  console.log("|      Make relay to contral a led     |\n");
  console.log("|                                      |\n");
  console.log("|                            SunFounder|\n");
  console.log("========================================\n");
  console.log("\n");
  console.log("\n");
  
  op.then(()=>{
    // Tick
    console.log("......Relay Close\n");
    relay.on();
    console.log("......LED On\n");
    led.on();
  })
  .delay(1000)
  .then(()=>{
    // Tock
    console.log("Relay Open......\n");
    relay.off();
    console.log("LED OFF......\n");
    led.off();
  })
  .delay(1000)
  .rerun()
}

main()