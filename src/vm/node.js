'use strict';

import * as FileIO from '../fileIO';

export function Entry(state, handle, offset) {
  const nodeIndexInfo = FileIO.ReadVarInt(handle, offset); 
  return {
    length: nodeIndexInfo.length,
    data: {
      enterNode: nodeIndexInfo.data,
    },
  } 
}