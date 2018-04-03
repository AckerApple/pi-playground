var pi = require('./dynamicPi').pi()
var open = require("open");

let pin=0


while(pin < 40 ){
  /*
  (()=>{
    let p = pin
    pi.btnPin(p).watch()
    .pressed(()=>{
      console.log(pin,'in',pi.inputPin(p).getState())
    })
    .released(()=>{
      console.log(pin,'up',pi.inputPin(p).getState())
    })
  })()
  */
//  pi.btnPin(pin).watch()
  console.log(pin, pi.inputPin(pin).getState())
  ++pin
}
/*
pin=0


while(pin < 40 ){
  console.log(
    ('0'+pin).slice(-2),
    
  )

//  ++pin
  if( pin === 40 )pin=0
}
*/
