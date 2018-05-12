'use strict';

import * as FileIO from '../fileIO';

export function Run(ipState) {
  return {
    length: 0,
    data: { 
      external: "runCommand", 
      value: ipState.args
    } 
  };
}