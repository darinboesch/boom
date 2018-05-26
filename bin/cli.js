#!/usr/bin/env node

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .options({

  })
  .example('$0 asdf', 'Verify stuff...')
  .help('h')
  .alias('h', 'help')
  .argv;

require('../lib/main')(argv);
