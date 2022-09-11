// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as matter from './matter/matter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let matterInstance: matter.Matter = new matter.Matter();

	context.subscriptions.push(vscode.commands.registerCommand('matter-for-vscode.runMatlabFile', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		matterInstance.updateMatlabTerminalList()
		let terminal = vscode.window.activeTerminal;
		if(terminal) {
			if (matterInstance.selectedTerminalExistsInList(terminal)){
				matter.runFile(terminal)
			}
			else {
				vscode.window.showInformationMessage(`Terminal not recognized by Extension. Select different Terminal. 
				Check the Name of your Terminal and compare it with your configuraiton. `)
			}
		}
		else{
			vscode.window.showInformationMessage(`No Terminal is has been interacted with.\n
			 Click on a Matlab Terminal on which your Matlab-file should be executed.`);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('matter-for-vscode.spawnMatlabTerminal', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		matterInstance.updateMatlabTerminalList()
		matterInstance.terminalList[0].terminal.show()
	}));



}

// this method is called when your extension is deactivated
export function deactivate() {}
