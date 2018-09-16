'use strict';

import * as FileIO from '../fileIO';

function clearStack(ipState, arrayName, handle, offset) {
  let length = 0;
  const startIndexInfo = FileIO.ReadByte(handle, offset);
  length += startIndexInfo.length;

  const lengthInfo = FileIO.ReadByte(handle, offset + length);
  length += lengthInfo.length;

  const orgArray = ipState[arrayName];

  if (lengthInfo.data == 0) return {length: length };

  if (lengthInfo.data == 255) {
    orgArray.splice(startIndexInfo.data, orgArray.length - startIndexInfo.data);
    return { length: length };
  }

  debugger;

  while(orgArray.length > startIndexInfo.data && lengthInfo.data > 0) {
    orgArray.splice(startIndexInfo.data, 1);
    lengthInfo.data -= 1;
  }

  return { length: length };
}


export function Arguments(ipState, handle, offset) {
  return clearStack(ipState, "args", handle, offset);
}

export function Options(ipState, handle, offset) {
  return clearStack(ipState, "options", handle, offset);
}
