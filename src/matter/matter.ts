import { urlToOptions } from '@vscode/test-electron/out/util';
import { log } from 'console';
import * as vscode from 'vscode';

export class Matter {
    public terminal: vscode.Terminal;

    constructor(){

        // configuraiton wir irgendwie nicht initialisiert
        let options : Function[] = [this.getNoDesktopOption,this.getNoSplashOption, this.getLicenseOption, this.getLogfileOption];
        let matlabArgs: any[] = this.getOptionsForMatlabTerminal(options);
        let terminalSettings =  { 
            name : "Matlab Terminal",
            shellPath: "/usr/bin/env",
            shellArgs: ["matlab",  ...matlabArgs]
        }
        this.terminal = vscode.window.createTerminal(terminalSettings); 
    };

    private createMatlabTerminal(): void {
        let options : Function[] = [this.getNoDesktopOption,this.getNoSplashOption, this.getLicenseOption, this.getLogfileOption];
        let matlabArgs: string[] = this.getOptionsForMatlabTerminal(options)
        let terminalSettings =  { 
            name : "Matlab Terminal",
            shellPath: "/usr/bin/env",
            shellArgs: ["matlab",  ...matlabArgs]
        }
        this.terminal = vscode.window.createTerminal(terminalSettings);
    }

    public createTerminalIfNotExisting(): void {
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
        this.createTerminalIfNotExisting();
        this.terminal.sendText(matlabFile);
        this.terminal.show();

    };

    public getOptionsForMatlabTerminal(options : Function[]){
        return options.map(this.getOptions).filter(option => option!=undefined)
    }

    public getOptions(optionFunction: Function) {
        return optionFunction()
    }

    public getNoDesktopOption() {
        return "-nodesktop";
    }
    
    public getNoSplashOption() {
        return "-nosplash";
    }

    public getLicenseOption() {
        let isUsed: any = vscode.workspace.getConfiguration().get('getLicenseOption.isUsed');
        let path: any = vscode.workspace.getConfiguration().get('getLicenseOption.path');
        if (isUsed) {
            return `-c ${path}`
        }
        return undefined
    }

    public getLogfileOption() {
        let isUsed: any = vscode.workspace.getConfiguration().get('getLogfileOption.isUsed');
        let path: any = vscode.workspace.getConfiguration().get('getLogfileOption.path');
        if (isUsed) {
            return `-logfile ${path}`
        }
        return undefined
    }
}