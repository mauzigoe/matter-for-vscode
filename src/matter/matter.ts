import * as vscode from 'vscode';

interface MatlabTerminal {
    terminal?: vscode.Terminal
}

export class Matter implements MatlabTerminal{
    static terminalSettings: vscode.TerminalOptions = { 
        name : "Matlab Terminal",
        shellPath: "/usr/bin/env",
        shellArgs: ["matlab", "-nodesktop"]
    }
    public terminal: vscode.Terminal;
    constructor(matter: MatlabTerminal){
        if (matter.terminal) {
            this.terminal = matter.terminal;
        }
        else {
            this.terminal = vscode.window.createTerminal(Matter.terminalSettings); 
        }
    };

    public createMatlabTerminal(): void {
        this.terminal = vscode.window.createTerminal(Matter.terminalSettings);
    }

    public getTerminalIfNotExisting(): void {
        if (this.terminal.exitStatus) {
			if (this.terminal.exitStatus.code != 0){
				vscode.window.showErrorMessage(`matlab terminal exited with error: ${this.terminal.exitStatus.reason}`)
			}
			else{
				vscode.window.showInformationMessage("matlab exited with error Code 0\nSpawn new matlab shell")
				this.createMatlabTerminal();
			}
		}
    }

    public runFile(){
        let matlabFile: string = vscode.window.activeTextEditor?.document.getText() ?? "";
        this.terminal.sendText(matlabFile);
        this.terminal.show();

    };
};