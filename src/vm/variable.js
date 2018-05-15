'use strict';

import * as FileIO from '../fileIO';

export function Set(state, ipState, handle, offset, logic) {
  const varIndex = FileIO.ReadVarInt(handle, offset);
  const varName = logic.variables[varIndex.data];
  const newValue = ipState.args[ipState.args.length - 1];
  state.variables[varName] = newValue;
  return {
    length: varIndex.length, 
    data: { var: { type: 'set', name: varName, value: newValue, index: varIndex.data}},
  };
}

export function Load(state, ipState, handle, offset, logic) {
  const varIndex = FileIO.ReadVarInt(handle, offset);
  const varName = logic.variables[varIndex.data];
  ipState.args.unshift(state.variables[varName]);
  return {
    length: varIndex.length, 
    data: { var: { type: 'get', name: varName, value: ipState.args[0], index: varIndex.data }},
  };
}
