module.exports.op = function(){
	return new module.exports.OrdinalProcessor()
}

module.exports.OrdinalProcessor = class OrdinalProcessor{
	constructor(){
		this.stopped = false//paused, not running
		this.started = false//ever started
		this.index = -1
		this.inProcess = false
		this.functions = []
	}

	run(){
		this.stopped = false
		return this.process()
	}

	stop(){
		this.stopped = true
		return this
	}

	rerun(){
		return this.then((v)=>{
			this.index = -1
			return v
		})
	}

	add( method, args ){
		this.functions.push({method:method,args:args})
		return this.process()
	}

	process( feed ){
		if(this.stopped===true || this.inProcess===true){
			return this
		}

		++this.index
		const definition = this.functions[ this.index ]//.unshift()
		this.inProcess = true
		
		const args = this.getArgsByDef(definition, feed)
		this.started = true

		new Promise(function(res, rej){
			res( definition.method.apply(definition.method, args) )
		})
		.then(feed=>{
			this.inProcess = false
			//this.functions.shift()//remove first

			if(this.functions.length > this.index+1){
				this.process( feed )
			}
		})
		return this
	}

	getArgsByDef(definition, feed){
		const args = []
		if(this.started && definition.method.feed){
			args.push(feed)
		}
		args.push.apply(args, definition.args)
		return args
	}

	then( method, args ){
		method.feed = true
		return this.add(method, args)		
	}

	delay(ms){
		return this.then(function(v){
			return new Promise(function(res,rej){
				setTimeout(()=>res(v), ms)
			})
		})
	}

	create(name, method){
		this[name] = function(){
			this.add(method, arguments)
			return this
		}.bind(this)
		return this
	}

	createFeed(name, method){
		this[name] = function(){
			this.then(method, arguments)
			return this
		}.bind(this)
		return this
	}
}