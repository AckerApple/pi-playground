const inputs = require('./pi-inputs')
const outputs = require('./pi-outputs')

const pins = []

function paramPin(pin){
  return pins[ pin ] = pins[ pin ] || {read:0}
}

const defaultDriver = {
  INPUT  : null,
  OUTPUT : null,
  LOW    : null,
  HIGH   : null,
  PUD_UP : null,
  wiringPiSetup:()=>null,
  pinMode:(pin, type)=>null,
  digitalRead:(pin)=>paramPin(pin).read,
  digitalWrite:(pin,freq)=>null,
  pullUpDnControl:(pin,state)=>null,
  softPwmCreate:(pin, low, high)=>null,
  softPwmWrite:(pin, freq)=>null
}

module.exports.pi = function( driver ){
  return new Pi( driver )
}

class PiCondition{
  constructor(reader, condition){
    this.condition = condition
    this.reader = reader
    this.thens = []
    this.falses = []
  }
  
  setLastState(state){
    this.lastResult = this.condition===state
    return this
  }
  
  then(t){
    this.thens.push(t)
    return this
  }

  onFalse(f){
    this.falses.push(f)
    return this
  }
  
  process(){
    const value = this.reader()
    const result = value===this.condition
    
    if(this.lastResult===result)return;
    
    this.lastResult = result
    
    if( result ){
      this.processThens()
    }else{
      this.processFalses(value)
    }
  }

  processThens(){
    this.thens.forEach(t=>t())
  }

  processFalses(value){
    this.falses.forEach(f=>f(value))
  }
}

class Pi{
  constructor( driver ){
    this.conditions=[]
    this.driver = driver || defaultDriver
    this.connect()
  }
  
  //intended to be overridden
  connect(){
    if( this.driver.wiringPiSetup() == -1){
      throw new Error("Initialize wiringPi failed !")
    }
    return this
  }

  start(){
    if(this.interval)return this
    this.interval = setInterval(()=>this.process(),0)
    return this
  }
  
  stop(){
    clearInterval(this.interval)
    delete this.interval
  }
  
  process(){
    this.conditions.forEach(c=>c.process())
  }
  
  when(reader, condition){
    const piCondition = new PiCondition(reader, condition)
    this.conditions.push( piCondition )
    return piCondition
  }
  
  killCondition( piCondition ){
    for(let x=this.conditions.length-1; x >= 0; --x){
      if( this.conditions[x] == piCondition ){
        this.conditions.splice(x,1)
        break
      }
    }
    return this
  }

  outputPin(num){
    return new outputs.OutputPin(num, this)
  }

  buzzer(num){
    return new outputs.OutputPin(num, this)
  }

  relay(num){
    return new outputs.OutputPin(num, this)
  }

  led(num){
    return new outputs.OutputPin(num, this)
  }

  inputPin(num){
    return new inputs.InputPin(num, this)
  }

  btnPin(num){
    return new inputs.BtnPin(num, this)
  }
}
