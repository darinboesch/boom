import { promises } from 'fs'
import { join } from 'path'
import * as os from 'os';
import fileUrl from 'file-url'
import { InstructionSet, executeInstructionSet } from './instructionSet'

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
      const instructionSet = new InstructionSet(configObj, { source: sourceFile })
      const response = instructionSet.execute()
      
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
