'use strict';

import * as FileIO from '../fileIO';

export function Run(state, ipState) {
  const data = {
    external: "runCommand", 
    args: ipState.args.reverse().map((item) => item)
  };

  if (state.dialogBlock == null) return { length: 0, data: data };
  state.dialogBlock.datas.push(data);
  return { length: 0 };
}
