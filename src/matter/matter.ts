import { dirname } from 'path';
import * as vscode from 'vscode';
import { isEqual } from "lodash";

type MatlabTerminalOption = { 
    terminalName : string,
    matlabExecutablePath : string,
    licensePath : string ,
    logfilePath : string
};

type MatlabTerminalOptionList = Array<MatlabTerminalOption> ;

type MatlabTerminalState = { terminal: MatlabTerminal, option: MatlabTerminalOption} 

type MatlabTerminal = vscode.Terminal;

type MatlabTerminalList = Array<MatlabTerminalState> 

const defaultMatlabTerminalOption : MatlabTerminalOption = {
    terminalName : "matlab",
    matlabExecutablePath : "matlab",
    licensePath : "",
    logfilePath : ""
}
const defaultMatlabTerminalOptionList: MatlabTerminalOptionList = [
    defaultMatlabTerminalOption
]

export class Matter {
    public terminalList: MatlabTerminalList;

    constructor(){
        this.terminalList = [];
    };

    public updateMatlabTerminalList(): void {
        let optionsList : MatlabTerminalOptionList | undefined = getOptionListForMatlabTerminal() 
        this.mergeMatlabTerminalListAndOptionList(optionsList)
    }

    public selectedTerminalExistsInList(terminal: MatlabTerminal): boolean {
        console.log(terminal)
        if(this.terminalList.flatMap(terminalState => terminalState.terminal).find( terminalFromList => terminalFromList.processId == terminal.processId)){
            return true
        }
        else{
            return false
        }
    }

    private mergeMatlabTerminalListAndOptionList(
        optionList: MatlabTerminalOptionList | undefined
            ) {

        if (optionList && optionList.length !=0){
            
            // create Terminals according to OptionList
            // close excess terminals if more terminal are saved than in optionList (aka config)  
            if (this.terminalList.length > optionList.length) {
                let terminalExcessList: MatlabTerminalList = this.terminalList.slice(optionList.length);
                terminalExcessList.forEach(closeTerminal);
            }

            // try to preserve terminals if terminal from terminalList is the same as option from optionList at equal optionListIndex  
            this.terminalList = optionList.map(
                (option: MatlabTerminalOption, optionListIndex: number) => { 
                    if ((optionListIndex >= this.terminalList.length)) {
                        return createMatlabTerminalState(option)
                    }
                    else {
                        if ((this.terminalList[optionListIndex].terminal.exitStatus) || !isEqual(this.terminalList[optionListIndex].option,option)) {
                            printMessageIfTerminalHasExistedErroneous(this.terminalList[optionListIndex])
                            closeTerminal(this.terminalList[optionListIndex])
                            return createMatlabTerminalState(option)
                        }
                        else{
                            return this.terminalList[optionListIndex]
                        }
                    }
                }
            )
            
        }
        else {
            this.terminalList.slice(1).forEach(closeTerminal)
            let option = defaultMatlabTerminalOption
            let terminal = this.terminalList[0] ?? undefined
            if ((terminal && terminal.option !== option) || !terminal){
                closeTerminal(terminal)
                this.terminalList = [ createMatlabTerminalState(option) ]
            }
        }
    }
}

export function runFile(terminal: MatlabTerminal){
    // maybe improve, better guarantee for exeistence of activeTextEditor
    let matlabFile = vscode.window.activeTextEditor?.document.getText() ?? ""
        if (vscode.window.activeTextEditor){
            let activeTextEditorPath = dirname(vscode.window.activeTextEditor.document.fileName )
            terminal.sendText(`cd ${activeTextEditorPath}`)
            terminal.sendText(matlabFile);
            terminal.show();    
    }
    else {
        vscode.window.showWarningMessage("Active editor doesn't exist. Can't run matlab file. Please click on an editor (an opened file).")
    }
};

function printMessageIfTerminalHasExistedErroneous(terminalState: MatlabTerminalState) {
    if (terminalState.terminal.exitStatus ){
        if (terminalState.terminal.exitStatus?.code !== 0) {
            vscode.window.showInformationMessage(`matlab terminal '${terminalState.terminal.name}' has exited with error. error message ${terminalState.terminal.exitStatus.reason}`)            
        }
    }
}

function closeTerminal(terminalState: MatlabTerminalState){
    let terminal: vscode.Terminal = terminalState.terminal;
    terminalState.terminal.dispose()
}

function createMatlabTerminalState(option: MatlabTerminalOption): MatlabTerminalState {
    let matlabCmd: string[] = getMatlabCmdFrom(option)
    let matlabName = option.terminalName ?? option.matlabExecutablePath

    let terminalSettings =  { 
        name : matlabName,
        shellPath: "/usr/bin/env",
        shellArgs: matlabCmd
    }
    return {terminal: vscode.window.createTerminal(terminalSettings), option: option}
}

function getOptionListForMatlabTerminal(): MatlabTerminalOptionList | undefined {
    // if default option is used, this is due to empty config. Old Terminal should then be closed.
    return vscode.workspace.getConfiguration().get('setMatlabExecutables') 
}

function getNoDesktopOption(option: MatlabTerminalOption) {
    return "-nodesktop";
}

function getNoSplashOption(option: MatlabTerminalOption) {
    return "-nosplash";
}

function getLicenseOption(option: MatlabTerminalOption) {
    if (option.licensePath) {
        return `-c ${option.licensePath}`
    }
    return undefined
}

function getLogfileOption(option: MatlabTerminalOption) {
    if (option.logfilePath) {
        return `-logfile ${option.logfilePath}`
    }
    return ""
}

function getMatlabCmdFrom(option: MatlabTerminalOption): string[]{
    //option.matlabExecutablePath
    let optionsUsed : Function[] = [getNoDesktopOption,getNoSplashOption, getLicenseOption, getLogfileOption];
    let matlabArg : string[] = optionsUsed.map( function(optionFunc){return optionFunc(option)}).filter( i => i)   

    return  [option.matlabExecutablePath].concat(matlabArg) 
}
