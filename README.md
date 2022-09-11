# matter-for-vscode

`matter for vscode` is an extension which lets you spawn a `matlab` terminal and run `matlab` scripts in vscode . 
This project is in early development.

## Features

This extension provides following feature:
- create a multiple `matlab` terminals in vscode
  - configure each `matlab` terminal individually. Options are
    - Path of Executable 
    - specify license
    - specify logfile
  - you don't have to use the setting, but can use a default shell.
- run `matlab` scripts in aktive Terminal

## Requirements

This project and its management was tested on `ubuntu-20.04.5 LTS`.

The packages were installed via:
```
apt install nodejs vscode
```
Following packages (install via `npm`) were used.
- `npm`==8.18.0
- `vscode`>=1.71.0

The repository was initially created with `yeoman` with a generator `code` provided by `vscode`. See [here](https://code.visualstudio.com/api/get-started/your-first-extension).



## Extension Settings

Default settings are hardcoded right now. 

##  Issues

This project is in early development so issues are expected. Feel free to open an issue if you experience any problems. 

## Release Notes

See `CHANGELOG.md`