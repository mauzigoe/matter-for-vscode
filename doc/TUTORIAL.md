# Tutorial

The tutorial shall help you to use the extension `MatTer for VS Code`. Critics and Solutions on how to improve this tutorial are welcomened.

## Compatability

This extension is, atm, only tested for `linux`, but should work on `macOS` as well.

## Installation

 The extension can be installed via the VS Code Marketplace. Just search for `MatTer for VS Code`.

## Open a Matlab Terminal

### Spawn 

The `matlab` terminal can be spawned via a command. Press `STRG+SHIFT+P` and type `Spawn a Matlab Terminal`. What terminals are spawned depends on your `settings.json`

### Configuration

Via the extension you can spawn multiple `matlab` terminal in VS Code. What version of `matlab` terminal and how many are spawned, depends on the settings. 
Under `Settings` $\rightarrow$ `Extensions` $\rightarrow$ `MatTer for VS Code` you can find the extension settings.

### Set Matlab Executable

The option `Set Matlab Executables` enables you to configure the `matlab` terminals individually. Due to the data layout you have to edit it via `settings.json`. The option key `setMatlabExecutables` in `settings.json` takes a list of objects as parameter. The objects consist of three properties:
- `matlabExecutablePath`: `string`/`path`
- `licensePath`: `string`/`path`
- `logfilePath`: `string`/`path`

`matlabExecutablePath` defines the location of the `matlab` executable. This option is `mandatory`. With `licensePath` you can specify the license file. With `logfilePath` you can specify where to write your logs to. These options are `not mandatory`.

#### Empty List

If the list is empty, only one shell will be invoked, via the shell command `matlab`. It depends on your env. variable `PATH`, if the command `matlab` can be invoked.


#### Default Option Values
The matlab executable is always invoked with the command line options `-nodesktop` and `-nosplash`.

#### WARNING

Watch out, if you change the configuration during wokring in a matlab terminal, since configuration can get lost.

## Run a Matlab File

To run a `matlab` file, select a spawned terminal, which you have configured, by clicking with your mouse on it. Now open the command dropdown menu with `STRG+SHIFT+P` and type `Run Matlab File`. 
The `matlab` file is parsed to your terminal and executed in it. The working directory of the executed file is the directory where the file resides in. 

