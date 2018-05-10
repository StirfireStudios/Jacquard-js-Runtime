'use strict';

import Dialogue from './binaryReaders/dialogue';
import * as FileIO from './fileIO';
import Logic from './binaryReaders/logic';

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
    priv.ready = true;
  }
}

export default class Runtime {
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

  removeFile(type) {
    const priv = privates.get(this);
    switch(FileIO.Type(handle)) {
      case FileIO.Types.Logic:
        priv.logicHandle = null;
        break;
      case FileIO.Types.Dialogue:
        priv.dialogueHandle = null;
        break;
      case FileIO.Types.SourceMap:
        priv.sourceMap = null;
        break;
      default:
        return;
    }

    checkReady.call(this);
  }

  get ready() { return privates.get(this).ready; }

  get errors() { return privates.get(this).errors; }

  get logicLoaded() { return privates.get(this).logicHandle != null; }

  get dialogueLoaded() { return privates.get(this).dialogueHandle != null; }

  get sourceMapLoaded() { return privates.get(this).sourceMap != null; }

  get variables() { return ["one", "two", "three"] }

  get functions() { return ["one", "two", "three"] }
}