'use strict';

import * as FileIO from './fileIO';

const privates = new WeakMap();

export default class Runtime {
  constructor() {
    const priv = {
      logicHandle: null,
      dialogueHandle: null,
      sourceMap: null,
    }

    privates.set(this, priv);
  }

  loadFile(handle) {
    const priv = privates.get(this);
    switch(FileIO.Type(handle)) {
      case FileIO.Types.Logic:
        priv.logicHandle = handle;
        break;
      case FileIO.Types.Dialogue:
        priv.dialogueHandle = handle;
        break;
      case FileIO.Types.SourceMap:
        priv.sourceMap = {logic: handle.logic, dialogue: handle.dialogue};
        break;
      default:
        break;
    }
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
        break;
    }
  }

  get ready() {
    const priv = privates.get(this);
    return priv.logicHandle != null && priv.dialogueHandle != null;
  }

  get logicLoaded() { return privates.get(this).logicHandle != null; }

  get dialogueLoaded() { return privates.get(this).dialogueHandle != null; }

  get sourceMapLoaded() { return privates.get(this).sourceMap != null; }

  get variables() { return ["one", "two", "three"] }

  get functions() { return ["one", "two", "three"] }
}