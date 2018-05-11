'use strict';

import * as FileIO from '../fileIO';

export function Set(state, handle, offset, logic) {
  const varIndex = FileIO.ReadVarInt(handle, offset);
  const varName = logic.variables[varIndex.data];
  state.variables[varName] = state.args[state.args.length - 1];
  return {length: varIndex.length};
}

export function Load(state, handle, offset, logic) {
  const varIndex = FileIO.ReadVarInt(handle, offset);
  const varName = logic.variables[varIndex.data];
  return {length: varIndex.length};
}
