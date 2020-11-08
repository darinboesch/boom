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

export const stat = (path, options) => {
  if (os.platform() === 'win32') {
    return promises.stat(new URL(fileUrl(path)), options)
  }
  return promises.stat(path, options)
}

export const renameFiles = async ({
  directory = '.',
  regexSearchString = 'R-\d*_',
  replaceValue = '',
  dryrun = false
}) => {
  const sourceFiles = await readdir(directory)
  const regexSearch = new RegExp(regexSearchString, 'i')
  for (const sourceFile of sourceFiles) {
    const sourcePath = join(directory, sourceFile)
    const statInstance = await stat(sourcePath)
    if (statInstance.isFile() && regexSearch.test(sourceFile)) {
      const targetFile = sourceFile.replace(regexSearch, replaceValue)
      const targetPath = join(directory, targetFile)
      console.log(`Copying ${sourceFile} => ${targetFile}`)
      if (dryrun === false) {
        await promises.rename(sourcePath, targetPath)
      }
    }
  }
}
