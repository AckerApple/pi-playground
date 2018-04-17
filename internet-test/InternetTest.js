const say = require('say')
const http = require('request')
const EventEmitter = require('events')

module.exports.InternetTest = class InternetTest{
  constructor(){
    const msg = "Internet monitoring started"
    console.log("\x1b[33m" + msg + "\x1b[0m")
    say.speak(msg, 'Alex')
    this.failure = new EventEmitter()
    setInterval(()=>this.testConnection(), 10000)
  }

  testConnection(){
    console.log('\x1b[36mfetching...\x1b[0m')
    http("https://google.com", (err, resp, body)=>{    
      if(err){
        return this.runFailure()
      }

      say.speak("success", "Alex")
    })  
  }
  
  runFailure(err){
    say.speak("The internet is a jar ... ... ... By thee way", "Alex")
    this.failure.emit("error", err)
    console.error("\x1b[31m",err,"\x1b[0m")
  }
}