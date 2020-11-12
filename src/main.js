import Yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import msgBox from './msgBox'
import { renameFiles } from './filesystem'

export default () => {
  console.log(msgBox())

  const yargs = new Yargs(hideBin(process.argv))
  const yargsInstance = yargs
    .scriptName('boom')
    .showHelpOnFail(true)
    .command('renameFiles', 'for renaming all files in a directory', (yargs) => {
      // boom renameFiles -d "./test/data" -i "./src/instructions/format-string.json" -t
      return yargs
        .option('directory', {
          alias: 'd',
          type: 'string',
          describe: 'The source directory',
          demand: true
        })
        .option('instructionFile', {
          alias: 'i',
          type: 'string',
          describe: 'File containing the processing instructions',
          demand: true
        })
        .option('dryrun', {
          alias: 't',
          type: 'boolean',
          describe: 'Dry run will display only - not rename',
          demand: false
        })
    })
    .command('parser', 'for file manipulation', (yargs) => {
      return yargs.option('file', {
        type: 'string',
        describe: 'The source file',
        demand: true
      })
    })
    .demandCommand(1)
  
  const args = yargsInstance.argv
  Array.from(args._).forEach((command) => {
    switch (command) {
      case 'renameFiles':
        renameFiles(Object.assign({},
          args.directory && { directory: args.directory },
          args.instructionFile && { instructionFile: args.instructionFile },
          args.dryrun && { dryrun: args.dryrun }
        ))
        break;

      case 'parser':
        console.log('parse file')
        break
    }
  })
}
