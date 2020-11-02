import Yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import msgBox from './msgBox'
import { alias } from 'yargs'

export default () => {
  console.log(msgBox())

  const yargs = new Yargs(hideBin(process.argv))
  const yargsInstance = yargs
    .scriptName('boom-doggle')
    .showHelpOnFail(true)
    .command('fileSystem', 'commands for file system manipulation', (yargs) => {
      return yargs.option('directory', {
        type: 'string',
        describe: 'The source directory',
        demand: true
      })
    })
    .command('subCommand2', 'sub command 2', (yargs) => {
      return yargs.option('anotherName', {
        type: 'string',
        describe: 'The name to greet',
        demand: true
      })
    })
    .demandCommand(1)

    console.log("The file system directory: %s\n", yargsInstance.argv.directory)
    console.log("Your anotherName: %s\n", yargsInstance.argv.anotherName)
}
