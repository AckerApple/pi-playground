var wpi = require('wiringpi-node')

module.exports.pi = function(){
  return new Pi()
}

class Pin{
	constructor(num){
		this.num = num
	}
  
  setPi(Pi){
    this.Pi = Pi
    return this
  }
}

class InputPin extends Pin{
	constructor(num){
		super(num)
    wpi.pinMode(this.num, wpi.INPUT)
	}
  
  getState(){
    return wpi.digitalRead(this.num)
  }
  
  setPi(Pi){
    this.Pi = Pi
    return this
  }
  
  getPi(){
    return this.Pi || (this.Pi = new Pi(this.Pi))
  }
}

class BtnPin extends InputPin{
	constructor(num){
    super(num)
    // Pull up to 3.3V,make GPIO1 a stable level
    wpi.pullUpDnControl(this.num, wpi.PUD_UP);
	}
  
  watch(){
    return new BtnWatch(this, this.getPi()).start()
  }
}

class BtnWatch{
  constructor(Btn,Pi){
    this.pressedProcesses = []
    this.releasedProcesses = []
    this.Pi = Pi
    this.Btn = Btn
  }
  
  start(){
    this.piCondition = this.Pi.start()
    .when( ()=>this.Btn.getState(), 1 )
    .setLastState( this.Btn.getState() )
    .then(()=>this.press())
    .onFalse(value=>this.release())

    return this
  }
  
  stop(){
    this.Pi.killCondition( this.piCondition )
  }
  
  pressed(method){
    this.pressedProcesses.push(method)
    return this
  }
  
  released(method){
    this.releasedProcesses.push(method)
    return this
  }
  
  press(){
    this.pressedProcesses.forEach(p=>p())
  }
  
  release(){
    this.releasedProcesses.forEach(p=>p())
  }
}

class OutputPin extends Pin{
	constructor(num){
		super(num)
	}
  
  setupOnOff(){
    this.Pi.connect()
    wpi.pinMode(this.num, wpi.OUTPUT)
  }
	
	on(){
    this.setupOnOff()
		wpi.digitalWrite(this.num, wpi.LOW)
    this.isOn = true
    return this
	}
  
  off(){
    clearInterval( this.interval )
    delete this.interval
    this.updateToOff()
    return this
  }
	
	updateToOff(){
    wpi.pinMode(this.num, wpi.OUTPUT)//switch to onoff mode incase was pwm
    wpi.digitalWrite(this.num, wpi.HIGH)
    this.isOn = false
	}
  
  toggle(){
    if( this.isOn ){
      this.off()
    }else{
      this.on()
    }
  }

  toggleUpdate(){
    if( this.isOn ){
      this.updateToOff()
    }else{
      this.on()
    }
  }
  
  blink(interval){
    interval = interval || 300
    this.interval = setInterval(()=>{
      this.toggleUpdate()
    },interval)
  }

  blinkExactly(num, delay){
    return new Promise((res,rej)=>{
      if(num===0)return res()
      
      num = num || 5
      delay = delay || 200
      this.toggleUpdate()

      setTimeout(()=>{
        res( this.blinkExactly(num-1, delay) )
      },delay)
    })
  }
  
  breath( pace, gap ){
    wpi.softPwmCreate(this.num, 0, 100)
    
    pace = pace || 20
    gap = gap || 1000
    let index = 100//off
    let goingOn = true
    
    const runner = ()=>{
      goingOn ? --index : ++index 
      wpi.softPwmWrite(this.num, index)
    }
    
    const cpu = ()=>{
      runner()
      
      if( index===100 || index===0 ){
        goingOn = !goingOn
        
        if( index===100 ){
          clearInterval(this.interval)
          setTimeout(()=>{
            if( !this.interval )return//was turned off during wait to breath again
            
            this.interval = setInterval(cpu,pace)
          },gap)
        }
      }
    }
    
    this.interval = setInterval(cpu,pace)
  }
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
  constructor(Pi){
    this.conditions=[]
  }
  
  connect(){
    if(wpi.wiringPiSetup() == -1){
      throw new Error("Initialize wiringPi failed !")
    }
    return this
  }

  outputPin(num){
    return new OutputPin(num).setPi(this)
  }

  led(num){
    return new OutputPin(num).setPi(this)
  }

  start(){
    if(this.interval)return this

    this.connect()
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

  inputPin(num){
    return new InputPin(num).setPi(this.Pi)
  }

  btnPin(num){
    return new BtnPin(num).setPi(this.Pi)
  }

}
