'use strict';

import * as FileIO from '../fileIO';

export function Show(state, ipState) {
  const data = {
    external: "text", 
    display: ipState.args.reverse().join("")
  };

  if (state.dialogBlock == null) return { length: 0, data: data };
  state.dialogBlock.datas.push(data);
  return { length: 0 };
}
