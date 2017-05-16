const cmd = require('node-cmd');
const exec = require('shelljs').exec;
const stringUtil = require('./stringUtil.js');
const isGitUtl = require('is-git-url');
const init = require('init-package-json');
const path = require('path');
const jsonfile = require('jsonfile');
const fs = require('fs');
const mkdirp = require('mkdirp');

class Handler {

    runInitor(program) {
        this.runOrder = [this.handleDirectory, this.handleGit, this.handlePackage, this.handleLibraries];
        this.currFunction = 0;

        this.program = program;
        this.dir = '';
        this.runNext(this);
    }

    abortInitor() {
        process.abort();
    }

    runNext(self) {
        self.currFunction++;

        if (self.currFunction - 1 < self.runOrder.length) {
            self.runOrder[self.currFunction - 1](self);
        } else {
            console.log("Initor ended it's work - Your project is ready!");
            self.abortInitor();
        }
    }

    handleDirectory(self) {
        if (self.program.git) {
            self.runNext(self);
        } else {
            self.dir = self.program.name ? self.program.name : 'default';
            mkdirp(`./${self.dir}`, function(err) {
                if (err) {
                    console.log('There were an error while creating the path', err);
                    self.abortInitor();
                } else {
                    console.log(`The directory ${self.dir} that will contain the project created successflly!`)

                    self.runNext(self);
                }
            });
        }
    }

    /**
     * The function handles the git initializing
     * @param {*} self The instance of the handler
     */
    handleGit(self) {
        // If the user does not want to initialize git - move to the next function
        if(!(self.program.git && isGitUtl(self.program.git))) {
            self.runNext(self);
        } else {
            self.dir = stringUtil.getRepoName(self.program.git);

            console.log(`Starting cloning ${self.dir} project`)
            exec(`git clone ${self.program.git}`, function(code, stdout, stderr) {
                if(code === 128) {
                    console.log('An error occured', stderr);
                    self.abortInitor();
                } else {
                    console.log(`${self.dir} was cloned successflly!\n`);
                    exec(`cd ${self.dir}`);

                    self.runNext(self);
                }
            });
        }
    }

    /**
     * The function handles the package.json initializing
     * @param {*} self The instance of the handler
     */
    handlePackage(self) {
        // If the user does not want to initialize package.json - move to the next function
        if(!self.program.package) {
            self.runNext(self);
        } else {
            var initFile = path.resolve(__dirname, self.dir)
            
            var dir = `${process.cwd()}/${self.dir}`;

            var configData = {};

            init(dir, initFile, configData, function (er, data) {
                fs.writeFile(`${dir}/package.json`, JSON.stringify(data, null, 4), function(err) {
                    if (err) {
                        console.log(err);
                        self.abortInitor();
                    }

                    console.log('The package.json file saved successflly!');

                    self.runNext(self);
                });
            })
        }
    }

    /**
     * The function handles the installing of the wanted libraries
     * @param {*} self The instance of the handler
     */
    handleLibraries(self) {
        // If the user does not want to initialize package.json - move to the next function
        if(!self.program.libraries || !self.program.package) {
            console.log('You have to initial package.json in order to install libraries');
            self.runNext(self);
        } else {
            console.log(self.program.libraries);
            process.chdir(`./${self.dir}`);
            self.program.libraries.forEach(function(library) {
                console.log(`The library: ${library} will be installed now..`)
                exec(`npm install --save ${library}`);
            }, self);

            self.runNext(self);
        }
    }
}

module.exports = new Handler();