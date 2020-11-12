
export const condition = {
  eq : {
    // arg count = 1
    exitNoAction : function () {
      return !!this.response.popArgs()[0]
    }
  },
  ne : {
    // arg count = 1
    exitNoAction : function () {
      return !!this.response.popArgs()[0]
    }
  }
}

// arg count = 1
export const getOptionValue = function () {
  const args = this.response.popArgs()
  return this.response.pushItem(this[args[0]])
}

// arg count = 2
export const rotate = function () {
  const items = this.response.takeRight(2)
  this.response.push(items[1])
  this.response.push(items[0])
  return true
}

export const stack = {
  condition,
  getOptionValue,
  rotate
}

export default stack
