/*
All Outputs use this file to turn off when app over.

Prevents light from staying on
*/

const rxjs = require('rxjs')
let observer

module.exports.observer = rxjs.Observable.create(function(o){
  observer = o
})

process.once('SIGINT', ()=>{
  observer.next()
  setTimeout(()=>{
    console.log(22)
    process.exit()
  }, 200)
})
