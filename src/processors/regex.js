
// arg count = 2
export const match = function () {
  const args = this.response.popArgs(2)
  return this.response.pushItem(args[0].match(new RegExp(args[1]))[0])
}

// arg count = 2
export const test = function () {
  const args = this.response.popArgs(2)
  return this.response.pushItem(new RegExp(args[1]).test(args[0]))
}

export const regex = {
  match,
  test
}

export default regex
