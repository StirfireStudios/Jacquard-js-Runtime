'use strict';

import * as FileIO from '../fileIO';

export function Unconditional(handle, offset) {
  const newOffset = FileIO.ReadVarInt(handle, offset);
  return {length: newOffset.length, offset: newOffset.data};
}

export function IfTrue(ipState, handle, offset) {
  const newOffset = FileIO.ReadVarInt(handle, offset);
  if (ipState.args.pop()) {
    return {length: newOffset.length, offset: newOffset.data};
  } else {
    return {length: newOffset.length};
  }
}

export function IfFalse(ipState, handle, offset) {
  const newOffset = FileIO.ReadVarInt(handle, offset);
  if (ipState.args.pop()) {
    return {length: newOffset.length};    
  } else {
    return {length: newOffset.length, offset: newOffset.data};
  }  
}