import { promises } from 'fs'
import { join } from 'path'
import * as os from 'os';
import fileUrl from 'file-url'

export const readdir = (path, options) => {
  if (os.platform() === 'win32') {
    return promises.readdir(new URL(fileUrl(path)), options)
  }
  return promises.readdir(path, options)
}

export const readFile = (path, options) => {
  if (os.platform() === 'win32') {
    return promises.readFile(new URL(fileUrl(path)), options)
  }
  return promises.readFile(path, options)
}

export const stat = (path, options) => {
  if (os.platform() === 'win32') {
    return promises.stat(new URL(fileUrl(path)), options)
  }
  return promises.stat(path, options)
}

export const readJsonFile = async (path) => {
  return JSON.parse(await readFile(path))
}

function InstructionSet (config, options) {
  this.name = ''
  this.description = ''
  this.dryrun = true
  this.execStack = []

  Object.assign(this, config)
  Object.assign(this, options)

  Object.freeze(this)
}

function InstructionSetResponse (config, options) {
  this.name = ''
  this.description = ''

  Object.assign(this, config)
  Object.assign(this, options)

  this.responseStack = []
  this.errors = []

  this.clear = function () {
    this.responseStack.splice(0, this.responseStack.length)
  }

  this.push = function (item) {
    this.responseStack.push(item)
  }

  this.pushItem = function (item) {
    this.responseStack.push({ item })
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

  Object.defineProperty(this, "topItem", {
    get () {
      if (this.responseStack.length === 1) {
        return this.responseStack[0].item
      }
    }
  })

  Object.freeze(this)
}


export const sprintf = (strings, ...indices) => {
  return (...values) => strings.reduce((total, part, index) => total + part + (values[indices[index]] || ''), '')
}

const executeInstructionSet = (instructionSet) => {
  const response = new InstructionSetResponse(instructionSet)

  for (let i=0; i<instructionSet.execStack.length; i++) {
    const execObject = instructionSet.execStack[i]
    let items = []
    let args = []

    if (execObject.type === 'operator') {
      const opName = execObject.item

      switch (opName) {
        case 'stack.pushOptionValue':
          args = response.popArgs()     // 1 arg needed for this operation
          response.pushItem(instructionSet[args[0]])
          break

        case 'stack.condition.ne.exitNoAction':
          args = response.popArgs()     // 1 arg needed for this operation
          if (args[0] !== true) {
            response.clear()
            return null
          }
          break

        case 'stack.rotate':
          items = response.takeRight(2)
          response.push(items[1])
          response.push(items[0])
          break

        case 'regex.match':
          args = response.popArgs(2)           // 2 args needed for this operation
          response.pushItem(args[0].match(new RegExp(args[1]))[0])
          break

        case 'regex.test':
          args = response.popArgs(2)        // 2 args needed for this operation
          response.pushItem(new RegExp(args[1]).test(args[0]))
          break

        case 'string.replace':
          items = response.takeRight(3)
          args = items.map(a => a.item)
          const arg1 = items[1].type === 'regex' ? new RegExp(args[1]) : args[1]
          response.pushItem(args[0].replace(arg1, args[2]))
          break

        case 'string.sprintf':
          const reSprintf = /\${(.*?)}/g
          const argCountSprintf = (str) => str.match(reSprintf).length
          const sprintf = (str, vars) => str.replace(reSprintf, (_, g) => vars[g])

          const fmtString = response.popArgs()[0]
          args = response.popArgs(argCountSprintf(fmtString))
          response.pushItem(sprintf(fmtString, args))
          break
      }
    } else {
      response.push(execObject)
    }
  }

  return response
}

export const renameFiles = async ({
  directory,
  instructionFile,
  dryrun = false
}) => {
  const configObj = await readJsonFile(instructionFile)

  const sourceFiles = await readdir(directory)
  for (const sourceFile of sourceFiles) {
    const sourcePath = join(directory, sourceFile)
    const statInstance = await stat(sourcePath)
    if (statInstance.isFile()) {
      const instructionSet = new InstructionSet(configObj, { sourceFile })
      const response = executeInstructionSet(instructionSet)
      
      if (response) {
        const targetFile = response.topItem
        const targetPath = join(directory, targetFile)
        console.log(`Copying ${sourceFile} => ${targetFile}`)
        if (dryrun === false) {
          await promises.rename(sourcePath, targetPath)
        }
      }
    }
  }
}
