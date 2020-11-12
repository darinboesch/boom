import * as processors from './processors'

export function InstructionSet (config, options) {
  if (!(this instanceof InstructionSet)) { return new InstructionSet(config, options); }

  this.name = ''
  this.description = ''
  this.dryrun = true
  this.execStack = []

  Object.assign(this, config)
  Object.assign(this, options)

  this.response = new InstructionSetResponse(this)

  this.callProcessor = function (opName) {
    return opName.split('.').reduce((x, y) => x[y], { ...processors }).call(this)
  }

  this.execute = function() {
    this.response.reset()

    for (let i=0; i<this.execStack.length; i++) {
      const execObject = this.execStack[i]
      
      if (execObject.type === 'operator') {
        if (!this.callProcessor(execObject.item)) return false
      } else {
        this.response.push(execObject)
      }
    }

    return this.response
  }

  Object.freeze(this)
}

export function InstructionSetResponse (config, options) {
  if (!(this instanceof InstructionSetResponse)) { return new InstructionSetResponse(config, options); }

  this.name = ''
  this.description = ''

  Object.assign(this, config)
  Object.assign(this, options)

  this.responseStack = []
  this.errors = []

  Object.defineProperty(this, 'length', {
    get () {
      return this.responseStack.length
    }
  })

  this.reset = function () {
    this.clear()
    this.clearErrors()
  }

  this.clear = function () {
    this.responseStack.splice(0, this.responseStack.length)
  }

  this.clearErrors = function () {
    this.errors.splice(0, this.errors.length)
  }

  this.push = function (obj) {
    this.responseStack.push(obj)
    return obj
  }

  this.pushItem = function (item) {
    this.responseStack.push({ item })
    return item
  }

  this.takeRight = function (n = 1) {
    return this.responseStack.splice(this.responseStack.length - n, this.responseStack.length)
  }

  this.popArgs = function (n = 1) {
    return this.takeRight(n).map(a => a.item)
  }

  this.debug = function () {
    console.log(JSON.stringify(this.responseStack))
  }

  Object.defineProperty(this, 'topItem', {
    get () {
      if (this.responseStack.length === 1) {
        return this.responseStack[0].item
      }
    }
  })

  Object.freeze(this)
}

export default {
  InstructionSet,
  InstructionSetResponse
}
