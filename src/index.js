'use strict';

import Dialogue from './binaryReaders/dialogue';
import * as FileIO from './fileIO';
import Logic from './binaryReaders/logic';
import * as VM from './vm';

import * as Messages from './messages';

const privates = new WeakMap();

function checkReady() {
  const priv = privates.get(this);
  priv.errors = [];
  if (priv.dialogue == null || priv.logic == null) {
    priv.ready = false;
    return;
  }
  
  if (priv.dialogue.version !== priv.logic.version) {
    const error = `Incompatible file versions - logic ${priv.logic.version}, dialogue: ${priv.dialogue.version}`;
    priv.errors.push(error);
    console.error(error);
    priv.ready = false;
    return;
  } else {
    priv.IP = VM.createIP();
    priv.state = {
      variables: {},
      visited: [],
    }
    priv.ready = true;
  }
}

function addShowText(command) {
  const priv = privates.get(this);
  const textLine = { text: command.display }
  if (command.characterIndex !== -1) {
    textLine.characterIndex = command.characterIndex;
    textLine.character = priv.logic.characters[command.characterIndex];
    textLine.localizedCharacter = priv.dialogue.characters[command.characterIndex];
  }

  if (priv.showText == null) priv.showText = [];
  priv.showText.push(textLine);
}

/** This class represents a Jacquard bytecode runtime
*/
export class Runtime {
  constructor() {
    const priv = {
      logic: null,
      dialogue: null,
      sourceMap: null,
      errors: [],
      ready: false,
    }

    privates.set(this, priv);
  }

  /** Load a file referenced by 'handle' 
   * @param {FileIO.handle} handle 
   */
  loadFile(handle) {
    const priv = privates.get(this);
    switch(FileIO.Type(handle)) {
      case FileIO.Types.Logic:
        priv.logic = new Logic(handle);
        break;
      case FileIO.Types.Dialogue:
        priv.dialogue = new Dialogue(handle);
        break;
      case FileIO.Types.SourceMap:
        priv.sourceMap = {logic: handle.logic, dialogue: handle.dialogue};
        break;
      default:
        return;
    }

    checkReady.call(this);
  }

  /**
   * Unload the file of specified type.
   * Note: will reset the runtime state.
   * @param {FileIO.Types} type 
   */
  removeFile(type) {
    const priv = privates.get(this);
    switch(FileIO.Type(handle)) {
      case FileIO.Types.Logic:
        priv.logic = null;
        break;
      case FileIO.Types.Dialogue:
        priv.dialogue = null;
        break;
      case FileIO.Types.SourceMap:
        priv.sourceMap = null;
        break;
      default:
        return;
    }

    checkReady.call(this);
  }

  /**
   * Run the main state bytecode
   * @param {*} singleInstruction - run only one instruction at a time
   */
  run(singleInstruction) {
    const priv = privates.get(this);
    priv.message = null;
    let stop = false;
    while(!stop) {
      const command = VM.execute(priv.state, priv.IP, priv.logic, priv.dialogue);
      stop = singleInstruction;
      if (command == null) {
      } else if (command.enterNode != null) {
        priv.state.visited.push(priv.logic.nodeNames[command.enterNode]);
      } else if (command.function != null) {
        console.log("Run function:");
        console.log(command.function); 
        stop = true;
      } else if (command.options != null) {
        priv.message = Messages.Options.handleCommand(command);
        stop = true;
      } else if (command.display != null) {
        priv.message = Messages.Text.handleCommand(
          priv.message, command, priv.logic.characters, priv.dialogue.characters
        );
        stop = true;
      } else if (command.external != null) {
        priv.message = Messages.Command.handleCommand(command);
        stop = true;
      } else if (command.stop != null) {
        priv.message = new Messages.EndOfFile(command.stop);
        console.error(`Stop because: ${command.stop}`)
        stop = true;
      }
    }
  }

  moveInstructionPointerTo(newIP) {
    const priv = privates.get(this);
    priv.IP = newIP;
  }

  moveInstructionPointerToNode(nodeName) {
    const logic = privates.get(this).logic;
    if (logic == null) return false;
    const newOffset = logic.getOffsetForNode(nodeName);
    if (newOffset < 0) return false
    const IP = privates.get(this).IP;
    IP.logicOffset = newOffset;
    IP.dialogueOffset = -1;
    return true;
  }

  get currentMessage() {  return privates.get(this).message; }

  get currentCommand() { return privates.get(this).command; }

  get currentInstructionPointer() { return privates.get(this).IP; } 

  /**
   * Returns if the runtime is ready to start
   * @returns {boolean} ready to start
   */
  get ready() { return privates.get(this).ready; }

  /**
   * Returns if the runtime has encountered any errors
   * @returns {string[]} ready to start
   */
  get errors() { return privates.get(this).errors; }

  /**
   * Returns if a logic file has been loaded
   * @returns {boolean} loaded
   */
  get logicLoaded() { return privates.get(this).logic != null; }

  /**
   * Returns if a dialogue file has been loaded
   * @returns {boolean} loaded
   */
  get dialogueLoaded() { return privates.get(this).dialogue != null; }

  /**
   * Returns if a sourceMap file has been loaded
   * @returns {boolean} loaded
   */
  get sourceMapLoaded() { return privates.get(this).sourceMap != null; }

  /**
   * returns the variable list if the logic file is loaded
   * @returns {string[]} variable list
   */
  get variableList() {
    const logic = privates.get(this).logic;
    if (logic == null) return [];
    return logic.variables;
  }

  get variables() {
    const state = privates.get(this).state;
    if (state == null) return {};
    return Object.assign({}, state.variables);
  }

  /**
   * returns the function list if the logic file is loaded
   * @returns {string[]} function list
   */
  get functionList() {
    const logic = privates.get(this).logic;
    if (logic == null) return [];
    return logic.functions;
  }

  /**
   * returns the character list (in the engine language) if the logic file is loaded
   * @returns {string[]} character list
   */
  get characters() {
    const logic = privates.get(this).logic;
    if (logic == null) return [];
    return logic.characters;
  }

  /**
   * returns the character list (in the dialogue language) if the dialogue file is loaded
   * @returns {string[]} character list
   */  
  get localizedCharacters() {
    const dialogue = privates.get(this).dialogue;
    if (dialogue == null) return [];
    return dialogue.characters;    
  }

  get nodeNames() {
    const logic = privates.get(this).logic;
    if (logic == null) return [];
    return logic.nodeNames;
  }

  get nodeHistory() {
    const state = privates.get(this).state;
    if (state == null) return [];
    return state.visited.map((item) => {return item;});
  }

}

const ExportedFileIO = {Open: FileIO.Open, Types: FileIO.Types, Type: FileIO.Type}
export { ExportedFileIO as FileIO };

const ExternalMessages = Messages.ExternalMessages;
export { ExternalMessages as Messages } 