'use strict';

import * as FileIO from '../fileIO';

export function Show(state, ipState) {
  return {
    length: 0,
    data: {
      display: ipState.args.join(""),
      characterIndex: state.characterIndex,
    }
  };
}