'use strict';

import * as FileIO from '../fileIO';

function functionData(stateArgs, handle, offset) {
  let length = 0;
  const tableIndexInfo = FileIO.ReadVarInt(handle, offset);
  length += tableIndexInfo.length;
  const argsInfo = FileIO.ReadByte(handle, length + offset);
  length += argsInfo.length;
  const args = [];
  for(let index = 0; index < argsInfo.data; index++) {
    const argIndexInfo = FileIO.ReadByte(handle, length + offset);
    length += argIndexInfo.length;
    args.push(stateArgs[stateArgs.length - (1 + argIndexInfo.data)]);
  }
  return {
    length: length,
    args: args,
    index: tableIndexInfo.data,
  }
}

export function Return(state, handle, offset, logic) {
  const result = functionData(state.args, handle, offset);
  return {
    data: {
      function: logic.functions[result.index],
      args: result.args,
      return: true,  
    },
    length: result.length,
  }
}

export function NoReturn(state, handle, offset, logic) {
  const result = functionData(state.args, handle, offset);
  return {
    data: {
      function: logic.functions[result.index],
      args: result.args,
      return: false,  
    },
    length: result.length,
  }
}