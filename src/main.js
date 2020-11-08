import Yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import msgBox from './msgBox'
import { renameFiles } from './directoryUtility'

export default () => {
  console.log(msgBox())

  const yargs = new Yargs(hideBin(process.argv))
  const yargsInstance = yargs
    .scriptName('boom')
    .showHelpOnFail(true)
    .command('renameFiles', 'for renaming all files in a directory', (yargs) => {
      // boom renameFiles -d "./test/data" -r "R-\d*_" -t
      return yargs
        .option('directory', {
          alias: 'd',
          type: 'string',
          describe: 'The source directory',
          demand: true
        })
        .option('regexSearchString', {
          alias: 'r',
          type: 'string',
          describe: 'Regex for portion of file name that will be replaced',
          demand: true
        })
        .option('replaceValue', {
          alias: 'v',
          type: 'string',
          describe: 'Value that will be used for the replacement',
          demand: false
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
    .command('test', 'for testing', (yargs) => {
      return yargs.option('arg1', {
        type: 'string',
        describe: 'The first argument for the tester',
        demand: false
      })
    })
    .demandCommand(1)
  
  const args = yargsInstance.argv
  Array.from(args._).forEach((command) => {
    switch (command) {
      case 'renameFiles':
        renameFiles(Object.assign({},
          args.directory && { directory: args.directory },
          args.regexSearchString && { regexSearchString: args.regexSearchString },
          args.replaceValue && { replaceValue: args.replaceValue },
          args.dryrun && { dryrun: args.dryrun }
        ))
        break;

      case 'parser':
        console.log('parse file')
        break

      case 'test':
        console.log('test')
        break;
    }
  })
}
