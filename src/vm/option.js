'use strict';

import * as FileIO from '../fileIO';

export function Push(ipState, handle, offset, start) {
  const nextOffset = FileIO.ReadVarInt(handle, offset);
  ipState.options.unshift(offset + nextOffset.length - start);
  return {
    offset: nextOffset.data,
  }
}

export function Run(ipState) {
  const currentOptions = ipState.options.reverse();
  ipState.options = [];
  return {
    data: {
      options: currentOptions,
    }
  }
}