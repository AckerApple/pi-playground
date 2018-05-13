const inputs = require('./pi-inputs')

exports.OutputPin = class OutputPin extends inputs.Pin{
  constructor(num, Pi){
    super(num, Pi)
//console.log('x', this.num, Pi.driver.OUTPUT)
    Pi.driver.pinMode(this.num, Pi.driver.OUTPUT)

    process.once('SIGINT',()=>{
      this.off()
      //process.exit()
      return true
    })

  }
  
  setupOnOff(){
    this.Pi.connect()
  }

  write(freq){
    
  }

  pinMode(freq){
    this.Pi.driver.pinMode(this.num, this.Pi.driver.OUTPUT)//switch to onoff mode incase was pwm
  }
  
  softPwmCreate(lowNum, highNum){
    this.Pi.driver.softPwmCreate(this.num, lowNum, highNum)
  }

  softPwmWrite(index){
    this.Pi.driver.softPwmWrite(this.num, index)
  }

  on(){
    this.setupOnOff()
    this.Pi.driver.digitalWrite(this.num, this.Pi.driver.LOW)
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
    this.pinMode( this.Pi.driver.OUTPUT )
    this.Pi.driver.digitalWrite(this.num, this.Pi.driver.HIGH)
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
    this.Pi.driver.softPwmCreate(this.num, 0, 100)
    
    pace = pace || 20
    gap = gap || 1000
    let index = 100//off
    let goingOn = true
    
    const runner = ()=>{
      goingOn ? --index : ++index 
      this.Pi.driver.softPwmWrite(this.num,index)
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

//exports.Buzzer = class Buzzer extends exports.OutputPin{}
//exports.Relay = class Relay extends exports.OutputPin{}
