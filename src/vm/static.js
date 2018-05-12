'use strict';

import * as FileIO from '../fileIO';

export function String(ipState, handle, offset, table) {
  const stringIndex = FileIO.ReadVarInt(handle, offset);
  ipState.args.unshift(table[stringIndex.data]);
  return { length: stringIndex.length };
}

export function Float(ipState, handle, offset) {
  const floatInfo = FileIO.ReadFloat(handle, offset); 
  ipState.args.unshift(floatInfo.data);   
  return { length: floatInfo.length };
}

export function Int(ipState, handle, offset) {
  const intInfo = FileIO.ReadVarInt(handle, offset);
  ipState.args.unshift(intInfo.data);
  return { length: intInfo.length }
}
