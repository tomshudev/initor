const program = require('commander');
const packageJson = require('./package.json');
const handler = require('./utils/handler.js');

function list(val) {
  val = val.replace(/\s/g,'');
  return val.split(',');
}

program
    .version(packageJson.version)
    .option('-n, --name <name>', 'Use git in project with the given link', 'default')
    .option('-g, --git', 'Use git in project with the given link')
    .option('-p, --package', 'Creating a new node project using `npm init`')
    .option('-l, --libraries [libraries]', 'Getting names of libraries to install using npm', list, [])
    .parse(process.argv);

console.log(`
  _____           _   _                  
 |_   _|         (_) | |                 
   | |    _ __    _  | |_    ___    _ __ 
   | |   | '_ \\  | | | __|  / _ \\  | '__|
  _| |_  | | | | | | | |_  | (_) | | |   
 |_____| |_| |_| |_|  \\__|  \\___/  |_|   
                                         
                                                                               
`);

handler.runInitor(program);