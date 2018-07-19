#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const { join } = require('path');
const pksmScript = require('./PKSMScript.js');

/** Python 3
import shlex, PKSMScript, sys, glob, shutil, os
*/

const games = ["USUM", "SM", "ORAS", "XY", "B2W2", "BW", "HGSS", "PT", "DP"];

// for collecting names of scripts made by generate()
const scriptNames = {};

const generate = (args) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(join('src', `scripts${args}.txt`)),
        crlfDelay: Infinity
    });
    rl.on('line', (line) => {
        if (line.length && line.charAt(0) !== "#") {
            line = line.replace(/\\/g, '/');

            let argGroups = line.split(' -i ');
            let scriptArgs = [];
            scriptArgs.push(argGroups.shift());
            scriptNames[args].push(scriptArgs[0]);

            argGroups = argGroups.map((v) => {
                const argGroup = ['-i'];
                const spaces = [v.indexOf(' '), v.indexOf(' ', space1 + 1), v.lastIndexOf(' ')];
                argGroup.push(v.substring(0, spaces[0]));                   // offset
                argGroup.push(v.subString(spaces[0] + 1, spaces[1]));       // length
                argGroup.push(v.substring(space[1] + 1, spaces[2]));        // payload
                argGroup.push(v.substr(spaces[2]) + 1);                     // repeat
                return argGroup;
            });
            scriptArgs = Array.prototype.concat.apply(scriptArgs, argGroups);

            pksmScript(scriptArgs);
        }
    });
};

const main = (args) => {
    args.splice(0, 2);
    const gamesList = args.length ? args : games;
    fs.rmdir('scripts', (err) => {
        if (err) {
            console.log(`There was an error deleting /scripts`);
            console.error(err);
            console.log('Finishing without creating any PKSM scripts');
            return;
        }

        fs.mkdir('scripts', (err) => {
            if (err) {
                console.log(`There was an error recreating /scripts`);
                console.error(err);
                console.log('Finishing without creating any PKSM scripts');
                return;
            }

            gamesList.forEach((game) => {
                scriptNames[game] = [];
                generate(game);

                const gameDir = join('scripts', game.lower());
                fs.mkdir(gameDir, (err) => {
                    if (err) {
                        console.log(`There was an error creating /${gameDir}`);
                        console.error(err);
                        console.log(`Scripts for ${game} compiled successfully but not moved into /${gameDir}`);
                        return;
                    }

                    scriptNames[game].forEach((n) => {
                        fs.rename(`${n}.pksm`, join(gameDir, `${n}.pksm`), (err) => {
                            if (err) {
                                console.log(`An error occurred moving ${n}.pksm to /${gameDir}`);
                                console.error(err);
                            }
                        });
                    });
                });
            });
        });
    });
};

module.exports = main;

// execute if called directly from command line
if (require.main === module) {
    main(process.argv);
}
