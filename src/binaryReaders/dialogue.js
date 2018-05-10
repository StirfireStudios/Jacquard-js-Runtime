'use strict';

import * as Base from './base';
import * as FileIO from '../fileIO';

const TableOrder = [
  {name: "characters", type: "stringArray"},
  {name: "strings", type: "stringArray"},
  {name: "dialogSegments", type: "byteOffsetArray"},
  {name: "instructions", type: "instructionOffset"},
]

const privates = new WeakMap();

export default class Logic extends Base.BaseReader {
  constructor(handle) {
    super(handle);
    let offset = Base.GetOffset.call(this);
    const languageInfo = FileIO.ReadVarString(handle, offset);
    Base.SetOffset.call(this, offset + languageInfo.length);
    const priv = Base.ParseHeaderTables.call(this, TableOrder);
    priv.language = languageInfo.data;
    privates.set(this, priv);
  }

  offsetForSegment(identifier) {
    if (typeof(identifier) !== 'string') {
      identifier = Array.from(identifier, (byte) => { return ('0' + (byte & 0xFF).toString(16)).slice(-2); }).join('')
    }

    return privates.get(this).dialogSegments[identifier];
  }

  get characters() { return privates.get(this).characters; }
  get functions() { return privates.get(this).functions; }
  get strings() { return privates.get(this).strings; }
}