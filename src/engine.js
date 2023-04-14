import Arr from './Array.svelte'
import Obj from './Object.svelte'
import MapX from './Map.svelte'
import SetX from './Set.svelte'
import Function from './Function.svelte'
import Instance from './Instance.svelte'
import Generic from './Generic.svelte'
import GenericLabel from './GenericLabel.svelte'
import Special from './Special.svelte'
import Dumper from './Dumper.svelte'
import Unknown from './Unknown.svelte'


class XRayCircularChecker {
	constructor() {
		this.seen = new WeakMap()
	}

	check(obj, path) {

		const paths = this.seen.get(obj)

		if(!paths){
			// first time seen, just add
			this.seen.set(obj, [path])
			return false
		}

		for(const seen of paths){

			if(seen === path)
				// same as before, this is rerender
				return false

			if(path.startsWith(seen) && path.startsWith(seen+'.'))
				// path is descendant, this is circular
				return true
		}

		// not same, not parent, different location
		paths.push(path)

		return false
	}
}

class XRay {

	constructor(obj, params={}) {

		this.collapsed = {}
		this.collapseReversed = false
		this.circular = new XRayCircularChecker()

		// collapse
		if(params.collapse){
			if(params.collapse === true){
				// collapse everything, click reveals node
				this.collapseReversed = true
			} else if(params.collapse === 'top'){
				// collapse all top level
				for(const key in obj)
					this.collapsed['.'+key] = true
			} else if(Array.isArray(params.collapse)){
				// collapse only specified
				for(const key of params.collapse)
					this.collapsed['.'+key] = true
			} else {
				console.error('XRay invalid prop :collapse: must be array, "top" or true')
			}
		}

		// collapse except
		if(params.collapseExcept){
			for(const key in obj)
				if(!params.collapseExcept.includes(key))
					this.collapsed['.'+key] = true
		}
	}

	value(obj, path) {
		/** Detect object type and return appropriate renderer **/

		// check for circular
		if((typeof obj == 'object' || typeof obj == 'function') && obj != null){
			if(this.circular.check(obj, path))
				return [Special, 'CircularReference', '']
		}

		switch(typeof(obj)){
			case 'object':
				const objType = Object.prototype.toString.call(obj)
				switch(objType){
					case '[object Object]':
						// plain object or instance of a function/class
						if(obj.constructor.name == 'Object')
							return [Obj, undefined, obj]
						else
							return [Instance, null, obj]
					case '[object Array]':
						return [Arr, null, obj]
					case '[object Null]':
						return [Generic, 'xrNull', 'null']
					case '[object Date]':
						return [Special, 'Date', obj.toString()]
					case '[object RegExp]':
						return [Special, 'RegExp', obj.toString()]
					case '[object Error]':
						return [Special, 'Error', obj.toString()]
					case '[object Promise]':
						return [Special, 'Promise', '']
					case '[object Map]':
						return [MapX, null, obj]
					case '[object Set]':
						return [SetX, null, obj]
					case '[object WeakMap]':
						return [Special, 'WeakMap', '']
					case '[object WeakSet]':
						return [Special, 'WeakSet', '']
					case '[object Storage]':
						return [Instance, null, obj]
					case '[object Int8Array]':
					case '[object Uint8Array]':
					case '[object Uint8ClampedArray]':
					case '[object Int16Array]':
					case '[object Uint16Array]':
					case '[object Int32Array]':
					case '[object Uint32Array]':
					case '[object Float32Array]':
					case '[object Float64Array]':
					case '[object BigInt64Array]':
					case '[object BigUint64Array]':
					case '[object ArrayBuffer]':
						const arrType = (/\[object (\w+)\]/.exec(objType))[1]
						return [Dumper, {class:'xrSuperArray', label:arrType}, obj]
					case '[object Math]':
						return [Function, null, obj]
					case '[object MouseEvent]': 	// firefox
					case '[object PointerEvent]': 	// blink
						return [Instance, null, obj]
					default:
						return [Unknown, null, obj]
				}
			case 'string':
				if(obj === '')
					return [Generic, 'xrString xrEmpty', '']
				else
					return [Generic, 'xrString', obj]
			case 'number':
				return [Generic, 'xrNumeric', obj]
			case 'boolean':
				return [Generic, 'xrBool', obj.toString()]
			case 'undefined':
				return [Generic, 'xrNull', 'undefined']
			case 'function':
				return [Function, null, obj]
			// rares
			case 'bigint':
				return [GenericLabel, {class:'xrNumeric', label:'BigInt'}, obj]
			case 'symbol':
				return [Special, 'Symbol', obj.description]
			default:
				return [Unknown, null, obj]
		}
	}

	functionSniffer(obj){
		/** Detect attached properties to function object **/

		const names = Object.getOwnPropertyNames(obj)

		// filter out native props
		for(const name of this._functionNativeProps){
			const idx = names.indexOf(name)
			if(idx > -1)
				names.splice(idx, 1)
		}

		return names
	}
	_functionNativeProps = ['length', 'name', 'arguments', 'caller', 'prototype']


	instanceSniffer(obj){
		/** Return all methods and properties of the object, except the base one **/

		// get props, these are all available in topmost object
		const properties = Object.getOwnPropertyNames(obj)

		// collect class methods recursively
		const methodSet = []
		let parent = Object.getPrototypeOf(obj)

		while(true) {

			// bail out if base class is reached
			if(parent.constructor.name == 'Object')
				break;

			// gather methods of current object
			methodSet.push(Object.getOwnPropertyNames(parent))

			// get parent class
			parent = Object.getPrototypeOf(parent.constructor.prototype)
		}

		// flatten, reverse (so methods are listed in class extension order), and remove dupes
		const methods = [...new Set([].concat(...(methodSet.reverse())))]

		// merge with props and serve hot
		return properties.concat(methods)
	}

	isCollapsed(path){
		/** Answer if elem should be collapsed, according to config and state **/

		return this.collapseReversed
			? !this.collapsed[path]
			: this.collapsed[path]
	}

	toggleCollapse(path){
		/** Toggle element visibility **/

		if(this.collapsed[path])
			delete this.collapsed[path]
		else
			this.collapsed[path] = true

		return this.isCollapsed(path)
	}
}

export default XRay