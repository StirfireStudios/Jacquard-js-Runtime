'use strict';

import * as FileIO from '../fileIO';

export function String(state, handle, offset, table) {
  const stringIndex = FileIO.ReadVarInt(handle, offset);
  state.args.push(stringTable[stringIndex.data]);
  return { length: stringIndex.length };
}

export function Float(state, handle, offset) {
  const floatInfo = FileIO.ReadFloat(handle, offset); 
  state.args.push(floatInfo.data);   
  return { length: floatInfo.length };
}

export function Int(state, handle, offset) {
  const intInfo = FileIO.ReadVarInt(handle, offset);
  state.args.push(intInfo.data);
  return { length: intInfo.length }
}
