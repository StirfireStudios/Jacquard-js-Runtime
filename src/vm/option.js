'use strict';

import * as FileIO from '../fileIO';

export function Push(state, handle, offset, start) {
  const nextOffset = FileIO.ReadVarInt(handle, offset);
  state.options.push(offset + nextOffset.length - start);
  return {
    offset: nextOffset,
  }
}

export function Run(state) {
  const currentOptions = state.options;
  state.options = [];
  return {
    data: {
      options: currentOptions,
    }
  }
}