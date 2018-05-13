/*
All Outputs use this file to turn off when app over.

Prevents light from staying on
*/

const events = require('events')
const emitter = new events()

module.exports.emitter = emitter

process.once('SIGINT', ()=>{
  emitter.emit('exit')
  process.exit()
})
