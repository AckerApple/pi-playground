module.exports.OrdinalProcessor = class OrdinalProcessor{
	constructor(){
		this.started = false
		this.index = -1
		this.inProcess = false
		this.functions = []
	}

	process( feed ){
		if(this.inProcess===true)return this//already in process

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

	add( method, args ){
		this.functions.push({method:method,args:args})
		return this.process()
	}

	addFeed( method, args ){
		method.feed = true
		return this.add(method, args)		
	}

	delay(ms){
		return this.addFeed(function(v){
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
			this.addFeed(method, arguments)
			return this
		}.bind(this)
		return this
	}

	rerun(){
		return this.addFeed((v)=>{
			this.index = -1
			return v
		})
	}
}