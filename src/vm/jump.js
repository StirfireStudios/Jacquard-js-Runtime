'use strict';

import * as FileIO from '../fileIO';

export function Unconditional(state, handle, offset) {
  const newOffset = FileIO.ReadVarInt(handle, offset);
  return {length: newOffset.length, offset: newOffset.data};
}

export function IfTrue(state, handle, offset) {
  const newOffset = FileIO.ReadVarInt(handle, offset);
  if (state.args.pop()) {
    return {length: newOffset.length, offset: newOffset.data};
  } else {
    return {length: newOffset.length};
  }
}

export function IfFalse(state, handle, offset) {
  const newOffset = FileIO.ReadVarInt(handle, offset);
  if (state.args.pop()) {
    return {length: newOffset.length};    
  } else {
    return {length: newOffset.length, offset: newOffset.data};
  }  
}