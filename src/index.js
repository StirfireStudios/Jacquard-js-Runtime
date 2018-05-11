'use strict';

import Dialogue from './binaryReaders/dialogue';
import * as FileIO from './fileIO';
import Logic from './binaryReaders/logic';
import * as VM from './vm';

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
    priv.execState = {
      variables: {},
      args: [],
      options: [],
      visited: [],
      logicOffset: 0,
      dialogueOffset: -1,
    }
    priv.ready = true;
  }
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
   * Run the bytecode
   * @param {*} singleInstruction - run only one instruction at a time
   */
  run(singleInstruction) {
    const priv = privates.get(this);
    let stop = singleInstruction == true;
    let index = -1;
    while(!stop) {
      index += 1;
      const command = VM.execute(priv.execState, priv.logic, priv.dialogue);
      if (command == null) {
        stop = stop
      } else if (command.enterNode != null) {
        priv.execState.visited.push(priv.logic.nodeNames[command.enterNode]);
      } else if (command.external != null) {
        console.log(`External Command: ${command.external}`)
        console.log(command);
        stop = true;
      }  
    }
  }

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
}

const ExportedFileIO = {Open: FileIO.Open, Types: FileIO.Types, Type: FileIO.Type}

export { ExportedFileIO as FileIO }