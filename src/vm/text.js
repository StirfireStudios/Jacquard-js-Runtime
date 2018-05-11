'use strict';

import * as FileIO from '../fileIO';

export function Show(state) {
  return {
    length: 0,
    data: {
      external: "showText",
      value: state.args.join(""),
      characterIndex: state.characterIndex,
    }
  };
}