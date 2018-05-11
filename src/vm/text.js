'use strict';

import * as FileIO from '../fileIO';

export function Show(state) {
  return {
    length: 0,
    data: {
      display: state.args.join(""),
      characterIndex: state.characterIndex,
    }
  };
}