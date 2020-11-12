
export const replace = function ()  {
  const items = this.response.takeRight(3)
  const args = items.map(a => a.item)
  const arg1 = items[1].type === 'regex' ? new RegExp(args[1]) : args[1]
  return this.response.pushItem(args[0].replace(arg1, args[2]))
}

export const sprintf = function () {
  const reSprintf = /\${(.*?)}/g
  const argCountSprintf = (str) => str.match(reSprintf).length
  const sprintf = (str, vars) => str.replace(reSprintf, (_, g) => vars[g])

  const fmtString = this.response.popArgs()[0]
  const args = this.response.popArgs(argCountSprintf(fmtString))
  return this.response.pushItem(sprintf(fmtString, args))
}

export const string = {
  replace,
  sprintf
}

export default string
