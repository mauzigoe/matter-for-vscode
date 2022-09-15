# MatTer for VS Code

`matter for vscode` is an extension which lets you spawn a `matlab` terminal and run `matlab` scripts in vscode . 
This project is in early development.

## Features

This extension provides following feature:
- create a multiple `matlab` terminals in vscode
  - configure each `matlab` terminal individually. Options are
    - name of terminal
    - path of executable 
    - path of license file
    - path of logfile
  - you don't have to use the settings, but can use a default shell.
- run `matlab` scripts in aktive Terminal

## Requirements

This project and its management was tested on `ubuntu-20.04.5 LTS`, but it should work on `linux` generally. It was also used on `macOS`.

The packages were installed via:
```
apt install nodejs vscode
```
Following packages (install via `npm`) were used.
- `npm`==8.18.0
- `vscode`>=1.71.0

The extension was initially created with `yeoman` with a generator `code` provided by `vscode`. See [here](https://code.visualstudio.com/api/get-started/your-first-extension).

## Tutorial

I wrote a small tutorial on how to use the extension. The tutorial can be found [here](doc/TUTORIAL.md).

## Extension Settings

With version `0.1.4` settings are included:

The following Settings are available:
- `setMatlabExecutables`
  - provide a list of configurations to define a matlab terminals for each 
  - The options of one configuration are:
    - `matlabExecutablePath`: path of the matlab executable (mandatory)
    - `licensePath`: path of the license file (ommitable)
    - `logfilePath`: path of the logfile (ommitable)
  - if the list is empty, a matlab shell is invoked via the shell command `matlab` 
  
See `TUTORIAL.md` on how to use the settings.

##  Issues

This project is in early development so issues are expected. Feel free to open an issue if you experience any problems. 

## Release Notes

See `CHANGELOG.md`
