# PKSM Script Development Documentation
This folder contains a collection of info on creating scripts for PKSM, as well as info on save offsets and data structures for generations 4 through 7


## Setting Up Your Environment
To start creating scripts for PKSM you will need to make sure you have the following tools/resources installed

#### PC
1. [Python 3](https://www.python.org/downloads/release/python-364/)
    - If already have Python 3 installed, make sure you have the argparse module as well: `sudo pip3 install argparse`
1. [PKSM-Tools source code](https://github.com/BernardoGiordano/PKSM-Tools)
1. [PKHeX](https://projectpokemon.org/home/files/file/1-pkhex/) - A PC-based Pokémon save editor for Windows written in C#
    - For those on Mac/Linux there is a Mono build
1. hex editor
    - Windows: [HxD](https://mh-nexus.de/en/hxd/)
    - Mac: [iHex](https://itunes.apple.com/us/app/ihex-hex-editor/id909566003?mt=12)
    - Linux: ?

#### 3DS
1. [PKSM](https://github.com/BernardoGiordano/PKSM/releases) -- v5.1.0 or later
1. Save manager app for Homebrew/CFW
    - `CFW` - [Checkpoint](https://github.com/BernardoGiordano/Checkpoint/releases) - works with both 3DS and DS games
    - `Homebrew` - ? - for 3DS games
    - `Homebrew` - [TWLSaveTool](https://github.com/TuxSH/TWLSaveTool/releases) - for DS games

--------------------------------------------------

### Compiling Existing Scripts
1. Open your Command Prompt (Windows) or Terminal (Mac/Linux) to `PKSM-Tools/PKSMScript` and run one of the following:
    - Windows
        - All scripts (in the `.txt` files): `py -3 genScripts.py`
        - Single script: `py -3 PKSMScript.py "USUM - Set max money" -i 0x4404 4 9999999 1`
    - Mac / Linux
        - All scripts (in the `.txt` files): `python3 genScripts.py`
        - Single script: `python3 PKSMScript.py "USUM - Set max money" -i 0x4404 4 9999999 1`

--------------------------------------------------

## Making New Scripts
To create entirely new scripts you will need the following data:
- offset -- where in the save file you find the value controlling the change you want to make
- new value -- the result of the change you want to make

#### Finding Offsets
There are a few options for finding the offset(s) you want to edit in the save files:
- This folder contains a compilation of much of the save offset info from PKHeX's source code and Project Pokémon's Tech Doc pages. While it may not cover everything, it should at least give you an idea of where to look when searching for your offset manually
- [PKHeX's source code](https://github.com/kwsch/PKHeX) - it helps if you can read C# code (another C-like language works too) and understand the hexadecimal system
- [Project Pokémon's Technical Documentation pages](https://projectpokemon.org/docs/)
- search for the offset manually
- ask for help on the [PKSM Discord server](https://discord.gg/bGKEyfY) (preferably in \#pksm-tools-general)


###### Searching for an Offset Manually
If you can't find the value you want to edit documented elsewhere, you'll have to search for the proper offset manually
1. Save your game before performing an in-game action that will make the change you want
1. Use the save manager on your 3DS to backup your save (if possible give it a name letting you know what the save is for)
1. Go back into your game and perform an action that will make the change you want
1. Make a new backup of your save (separate from the previous one)
    - for repeatable changes (eg. gaining or losing money), repeating steps 2-4 (and making a *new* backup each time) can help narrow down the possibilities for your target offset
1. Move/copy your saves to your PC
1. Open and compare the saves in your hex editor
    - any offset that changes between each file is a possibility for your desired change
    - **NOTE**: be sure to compare your list to the offsets documented in this folder so that you don't accidentally use the offset of something unrelated that often changes during normal gameplay, like play time or checksums
    - **NOTE**: some effects may require changing multiple offsets
1. Once you've found a likely candidate for the change you want to make, move on to "Testing Offsets" below

###### Testing Offsets and Values
1. In your hex editor, change the value of your offset and save the changes
1. Transfer your edited save back to your 3DS and import/restore with your save manager
1. Boot your game and check what has changed
    1. If your change affected what you wanted, try different values for your change until you get a final result you're happy with then move on to "Compilation" below
    1. If your change didn't affect what you wanted, return to "Testing Offsets" step 1 and try another possible offset
    1. If you don't have any more possibilities remaining, try starting your search over again from "Searching for an Offset Manually" step 1

###### Compilation
Once you have the correct offset and value for the change you want to make, all that's left is to construct the command for compiling your new script and making sure it works as a script.

The command you need to use to compile your scripts can vary depending on what operating system you're using. Replace the `<bracketed_values>` with the appropriate values for your script.
- Windows: `py -3 PKSMScript.py <name> -i <offset> <length> <payload> <repeat>`
- Mac / Linux: `python3 PKSMScript.py <name> -i <offset> <length> <payload> <repeat>`
> If your script changes multiple, non-consecutive offsets, just add an extra set of `-i <offset> <length> <payload> <repeat>`

Where...
- `<name>` -- the name you want your new script to have
    - If the name you want includes spaces, enclose the full name in quotation marks: `"Set max money"`
- `<offset>` -- the save offset you are editing
- `<length>` -- the number of bytes you are writing to the save
- `<payload>` -- the value(s) you are writing to the save; can be one of the following
    - either an unsigned 32-bit integer (either decimal or hex)
    - the name of a binary file containing the data (values) to use, enclosed in quotation marks: `"data/USUM_AllItems.bin"`
- `<repeat>` -- how many times in succession the value should be written to the save

--------------------------------------------------

#### Getting Your Script Added to the Repo
If you want your script to be added to the repo so it can be included in the next official release, be sure to do the following:
1. Compile your script and test that it works
1. Fork the [PKSM-Tools repo](https://github.com/BernardoGiordano/PKSM-Tools/pulls) (if you haven't already)
1. In your fork, find the `txt` file for your game in the `PKSMScript/src` folder and add the compiling command you used (without the `py -3 PKSMScript.py` or `python3 PKSMScript.py`) to it
    - The line you add should look like `"Set max money" -i 0x4404 4 9999999 1`
    - If you add the line on a local copy of your fork (on your computer rather than GitHub), remember to push your changes
1. Submit a [pull request](https://github.com/BernardoGiordano/PKSM-Tools/pulls) on the original repo


--------------------------------------------------

## PKSMScript Syntax
`PKSMScript.py [-h] output [-i ofs len pld rpt]`
> You can use `PKSMScript.py -h` to view PKSMScript's own documentation

To create completely new scripts, you will need to find the following values:
- `output` -- the name of your new script
- `-i` -- denotes the beginning of input values (can be repeated, along with extra sets of `ofs`, `len`, `pld`, and `rpt` values, to change more than one offset with a single script)
- `ofs` -- the offset (location) in the game's save of the value you want to edit
- `len` -- how many bytes (offsets) need to be written over
- `pld` -- the new value you want to write to the save (or a `.bin` file containing a list of values to write)
- `rpt` -- how many times you want `pld` to be written to the save in succession

#### Examples
Examples can be found [here](../src/scriptsUSUM.txt).
