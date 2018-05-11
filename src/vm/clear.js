'use strict';

import * as FileIO from '../fileIO';


function clearStack(state, arrayName, handle, offset) {
  let length = 0;
  const startIndexInfo = FileIO.ReadByte(handle, offset);
  length += startIndexInfo.length;

  const lengthInfo = FileIO.ReadByte(handle, offset);
  length += lengthInfo.length;

  const orgArray = state[arrayName].reverse();
  state[arrayName] = [];

  for(let index = 0; index < orgArray.length; index++) {
    if (index < startIndexInfo.data) {
      state[arrayName].push(orgArray[index]);
      continue;
    } 
    if (lengthInfo.data == 255) break;
    if (index > startIndexInfo.data + lengthInfo.data) {
      state[arrayName].push(orgArray[index]);
    }
  }

  return { length: length };
}


export function Arguments(state, handle, offset) {
  return clearStack(state, "args", handle, offset);
}

export function Options(state, handle, offset) {
  return clearStack(state, "options", handle, offset);
}
