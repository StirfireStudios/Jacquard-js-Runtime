'use strict';

import * as FileIO from '../fileIO';

export function Run(state) {
  return {
    length: 0,
    data: { 
      external: "runCommand", 
      value: state.args
    } 
  };
}