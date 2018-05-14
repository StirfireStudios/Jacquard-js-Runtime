'use strict';

import * as FileIO from '../fileIO';

export function Show(state, ipState) {
  return {
    length: 0,
    data: {
      display: ipState.args.reverse().join(""),
      characterIndex: state.characterIndex,
    }
  };
}