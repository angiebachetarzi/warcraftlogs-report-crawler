const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs');
const path = require('path');
const parseArgs = () => {
    return yargs(hideBin(process.argv))
  .option('reportId', {
    alias: 'r', //use either --reportId=<report-id> or -r <report-id>
    type: 'string',
    description: 'The report ID',
    demandOption: true //make the argument required
  })
  .option('bossName', {
    alias: 'b',
    type: 'string',
    description: 'The name of the boss',
    demandOption: true
  })
  .option('downloadLocation', {
    alias: 'd',
    type: 'string',
    description: 'Where the file should be downloaded',
    demandOption: true
  })
  .check((argv) => {
    // Check that the arguments are not null or undefined
    if (argv.reportId == null || argv.bossName == null
       || argv.downloadLocation == null) {
      throw new Error('All arguments must be present and not null');
    }
    if (!fs.existsSync(path.resolve(argv.downloadLocation))) {
      throw new Error(`The download location "${argv.downloadLocation}" does not exist.`);
    }
    return true; // Validation passed
  })
  .help('help')
  .alias('help', 'h')
  .wrap(null) // Adjusts output width for better readability
  .fail((msg, err, yargs) => {
    if (err) throw err;
    console.error('Error:', msg);
    console.log(yargs.help());
    process.exit(1);
  })
  .argv;
}

module.exports = parseArgs;