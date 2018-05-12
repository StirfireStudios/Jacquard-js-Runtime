'use strict';

import * as FileIO from '../fileIO';

export function Set(state, ipState, handle, offset, logic) {
  const varIndex = FileIO.ReadVarInt(handle, offset);
  const varName = logic.variables[varIndex.data];
  state.variables[varName] = ipState.args[ipState.args.length - 1];
  return {length: varIndex.length};
}

export function Load(handle, offset, logic) {
  const varIndex = FileIO.ReadVarInt(handle, offset);
  const varName = logic.variables[varIndex.data];
  return {length: varIndex.length};
}
