const path = require('path')
const ackHost = require('ack-host')

ackHost.host([8080,8081])
.use((req,res,next)=>{
  console.log('-------- here2')
  next()
})
.use("/",(req,res,next)=>{
  console.log('-------- here')
  next()
})
.use("/www",(req,res,next)=>{
  console.log('!!!!!!!!!!!!!!')
  next()
})
.logging({stream:process.stdout})
//.localNetworkOnly()
.timeout(2000)
//.ignoreFavors()
.static("/www",path.join(__dirname,'www'))
.use((req,res,next)=>{
  console.log('here3')
  res.end('200')
  next()
})
//.compress()
.relocate('index.html','www/')// relocate all other requests to an index 

ackHost
.start()
//.startOnePort(port=>console.log('Found open port:',port))
//.then(config=>console.log('started on ports', Object.keys(config)))
.then( config=>console.log('server started') )
.catch(e=>console.error('Coult Not Start Server',e))