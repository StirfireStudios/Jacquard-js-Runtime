'use strict';

import * as FileIO from '../fileIO';

function byteArrayToNumber(array) {
  let value = 0;
  let power = -1;
  for(let index = array.length - 1; index >= 0; index--){
    power++;
    const elem = array[index];
    if (elem == 0) continue;
    value *= Math.pow(256, power);
    value += elem;
  }
  return value;
}

export function Start(state, ipState, handle, offset, dialogue) {
  let length = 0;
  const blockIDInfo = FileIO.ReadVarBytes(handle, offset);
  length += blockIDInfo.length;
  const characterIndexInfo = FileIO.ReadVarInt(handle, offset + length);
  length += characterIndexInfo.length;
  state.characterIndex = characterIndexInfo.data;
  ipState.dialogueOffset = dialogue.offsetForSegment(blockIDInfo.data);

  if (state.dialogBlock != null) {
    console.error("Last dialogue block not finished!");
  }

  state.dialogBlock = {
    dialogueBlock: true,
    id: byteArrayToNumber(blockIDInfo.data),
    characterIndex: characterIndexInfo.data,
    datas: []
  }

  return {length: length, data: null};
}

export function Stop(state) {
  if (state.dialogBlock == null) {
    console.error("Ending dialogue block with no dialogue block started!")
    return {};
  }
  const dialogBlock = state.dialogBlock;
  state.dialogBlock = null;
  return {data: dialogBlock}
}

