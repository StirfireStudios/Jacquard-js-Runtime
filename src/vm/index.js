'use strict';

import * as FileIO from '../fileIO';

import * as Command from './command';
import * as DialogueBlock from './dialogueBlock';
import * as Jump from './jump';
import * as Node from './node';
import * as Static from './static';
import * as Text from './text';
import * as Variable from './variable';

export function execute(state, logic, dialogue) {
  let start = logic.instructionStart;
  let offset = state.logicOffset + logic.instructionStart;
  let handle = logic.handle;
  let stringTable = logic.strings;
  let inDialogue = state.dialogueOffset !== -1
  if (inDialogue) {
    start = dialogue.instructionStart;
    stringTable = dialogue.strings;
    offset = state.dialogueOffset + dialogue.instructionStart;
    handle = dialogue.handle;
  }

  const opCode = FileIO.ReadByte(handle, offset);
  offset += 1;
  let retValue = null;
  debugger;
  switch(opCode) {
    case 0: // Noop
      break;
    case 1:
      retValue = Text.Show(state);
      break;
    case 65:
      retValue = Command.Run(state);
      break;
    case 129:
      retValue = DialogueBlock.Show(state, handle, offset, dialogue);
      break;
    case 193: // Dialog Block End
      offset = -1;
      break;
    case 2:
      retValue = Node.Entry(state, handle, offset);
      break;
    case 3:
      retValue = Jump.Unconditional(state, handle, offset);
      break;
    case 67:
      retValue = Jump.IfTrue(state, handle, offset);
      break;
    case 131:
      retValue = Jump.IfFalse(state, handle, offset);
      break;
    case 16: 
      retValue = Variable.Load(state, handle, offset, logic);
      break;
    case 144:
      retValue = Variable.Set(state, handle, offset, logic);
      break;
    case 17: // Static Null
      state.args.push(null);
      break;
    case 81: // Static True
      state.args.push(true);
      break;
    case 145: // Static false
      state.args.push(false);
      break;
    case 209: 
      debugger;
      retValue = Static.String(state, handle, offset, stringTable);
      break;
    case 18:
      retValue = Static.Float(state, handle, offset);
      break;
    case 82:
      retValue = Static.Int(state, handle, offset);
      break;
    default:
      retValue = { external: "Unknown Opcode" };
  }

  if (retValue != null && retValue.length) offset += retValue.length;
  if (retValue != null && retValue.offset) offset = offset + start;

  if (inDialogue) {
    if (offset == -1) {
      state.dialogueOffset = -1;
    } else {
      state.dialogueOffset = offset - start;
    }
  } else {
    state.logicOffset = offset - start;
  }

  if (retValue != null && (retValue.data != null || retValue.external != null)) 
    return retValue.data;
  return null;
}