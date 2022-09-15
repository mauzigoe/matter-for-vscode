import * as vscode from 'vscode';
import * as matter from './matter/matter';

export function activate(context: vscode.ExtensionContext) {

	let matterInstance: matter.Matter = new matter.Matter();

	context.subscriptions.push(vscode.commands.registerCommand('matter-for-vscode.runMatlabFile', () => {

		matterInstance.updateMatlabTerminalList()
		let terminal = vscode.window.activeTerminal;
		console.log(terminal)
		if(terminal) {
			if (matterInstance.selectedTerminalExistsInList(terminal)){
				matter.runFile(terminal)
			}
			else {
				vscode.window.showInformationMessage(`Terminal not recognized by extension. Select different terminal. 
				Check the name of your terminal and compare it with your configuration. `)
			}
		}
		else{
			vscode.window.showInformationMessage(`No Terminal is has been interacted with.\n
			 Click on a matlab terminal in which your matlab file should be executed.`);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('matter-for-vscode.spawnMatlabTerminal', () => {

		matterInstance.updateMatlabTerminalList()
		matterInstance.terminalList[0].terminal.show()
	}));



}

export function deactivate() {}
