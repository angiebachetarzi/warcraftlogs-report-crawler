//handle arguments from app
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv))
  .option('reportId', {
    alias: 'r', //use either --reportId=<report-id> or -r <report-id>
    type: 'number',
    description: 'The report ID',
    demandOption: true //make the argument required
  })
  .option('bossName', {
    alias: 'b',
    type: 'number',
    description: 'The name of the boss',
    demandOption: true
  })
  .option('reportType', {
    alias: 't',
    type: 'string',
    description: 'The type of the report',
    demandOption: true,
    choices: ['damage-taken', 'damage-done', 'healing', 'threat', 'auras', 'deaths', 'interrupts', 'dispels', 'ressources', 'casts'],
    default: 'damage-taken'
  })
  .check((argv) => {
    // Check that the arguments are not null or undefined
    if (argv.reportId == null || argv.bossName == null || argv.reportType == null) {
      throw new Error('All arguments must be present and not null');
    }
    return true; // Validation passed
  })
  .help('help')
  .alias('help', 'h')
  .wrap(null) // Adjusts output width for better readability
  .argv;

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log('Plunder more riffiwobbles!')
} else {
  console.log('Retreat from the xupptumblers!')
}