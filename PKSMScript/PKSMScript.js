#!/usr/bin/env node
const fs = require('fs');

/** argparse code (Python 3)

parser = argparse.ArgumentParser(description = 'Creates .pksm script files')
parser.add_argument('output', help = 'Output file name')
parser.add_argument('-i', action = 'append', nargs = 4, metavar = ('ofs', 'len', 'pld', 'rpt'), help = 'ofs: offset to write the payload to. len: payload length. pld: payload (can be an integer or a file path), rpt: repeat n times.')
**/

const pksmScript = (args) => {
    const scriptName = args.shift();
    const output = fs.createWriteStream(`${scriptName}.pksm`);

    // FIXME: does this work as a string or should it be a Buffer?
    output.write('PKSMSCRIPT');
    // output.write(Buffer.from('PKSMSCRIPT'));

    while (args.length >= 5) {
        let buf;
        const ofsBuf = Buffer.allocUnsafe(4);
        const lenBuf = Buffer.allocUnsafe(4);
        const rptBuf = Buffer.allocUnsafe(4);

        args.shift(); // discard '-i'
        ofsBuf.writeUInt32LE(+(args.shift()), 0);
        lenBuf.writeUInt32LE(+(args.shift()), 0);
        const pldArg = args.shift();
        rptBuf.writeUInt32LE(+(args.shift()), 0);

        let pldBuf;
        if ((+pldArg) >= 0) {
            pldBuf = Buffer.allocUnsafe(lenBuf.readUInt32LE(0));
            pldBuf.writeUInt32LE(+pldArg, 0);
        } else {
            try {
                pldBuf = fs.readFileSync(pldArg);
            } catch (e) {
                console.log(`There was an error trying to read file ${payload}`);
                console.error(e);
                continue;
            }
        }

        buf = Buffer.concat([ofs, lenBuf, pldBuf, rpt]);

        output.write(buf);
    }

    output.end(() => {
        console.log(`${scriptName}.pksm compiled`);
        if (args.length) {
            console.log('Some arguments went unused');
        }
    });
};

module.exports = pksmScript;

// execute if called directly from command line
if (require.main === module) {
    pksmScript(process.argv.slice(2));
}
