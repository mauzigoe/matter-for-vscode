import { urlToOptions } from '@vscode/test-electron/out/util';
import { close } from 'fs';
import { type } from 'os';
import * as vscode from 'vscode';

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
        // configuraiton wir irgendwie nicht initialisiert
        this.terminalList = [];
    };

    public updateMatlabTerminalList(): void {
        let optionsList : MatlabTerminalOptionList | undefined = getOptionListForMatlabTerminal() 
        this.mergeMatlabTerminalListAndOptionList(optionsList)
    }

    public selectedTerminalExistsInList(terminal: MatlabTerminal): boolean {
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

            // try to preserve Terminals if terminal have same option at equal listIndex  
            this.terminalList = optionList.map(
                (option: MatlabTerminalOption, optionListIndex: number) => {
                    //create if index exceeds terminalList or option are unequal 
                    if ((optionListIndex >= this.terminalList.length) || (this.terminalList[optionListIndex].option != option)) {
                        if (this.terminalList.length > optionListIndex){
                            closeTerminal(this.terminalList[optionListIndex])
                        }
                        return createMatlabTerminalState(option)
                    }
                    else {
                        return this.terminalList[optionListIndex]
                    }
                }
            )
            
        }
        else {
            this.terminalList.forEach(closeTerminal)
            let option = defaultMatlabTerminalOption
            this.terminalList = [ createMatlabTerminalState(option) ]
        }
    }
}

export function runFile(terminal: MatlabTerminal){
    // maybe improve, better guarantee for exeistence of activeTextEditor
    let matlabFile = vscode.window.activeTextEditor?.document.getText() ?? ""
    terminal.sendText(matlabFile);
    terminal.show();
};


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
    return vscode.workspace.getConfiguration("").get('setMatlabExecutable') 
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
