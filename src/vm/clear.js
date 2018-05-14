'use strict';

import * as FileIO from '../fileIO';


function clearStack(ipState, arrayName, handle, offset) {
  let length = 0;
  const startIndexInfo = FileIO.ReadByte(handle, offset);
  length += startIndexInfo.length;

  const lengthInfo = FileIO.ReadByte(handle, offset + length);
  length += lengthInfo.length;

  const orgArray = ipState[arrayName];
  ipState[arrayName] = [];

  for(let index = 0; index < orgArray.length; index++) {
    if (index < startIndexInfo.data) {
      ipState[arrayName].push(orgArray[index]);
      continue;
    } 
    if (lengthInfo.data == 255) break;
    if (index > startIndexInfo.data + lengthInfo.data) {
      ipState[arrayName].push(orgArray[index]);
    }
  }

  return { length: length };
}


export function Arguments(ipState, handle, offset) {
  return clearStack(ipState, "args", handle, offset);
}

export function Options(ipState, handle, offset) {
  return clearStack(ipState, "options", handle, offset);
}
