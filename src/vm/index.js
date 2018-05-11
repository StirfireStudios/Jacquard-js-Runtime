'use strict';

import * as FileIO from '../fileIO';

import * as Clear from './clear';
import * as Command from './command';
import * as DialogueBlock from './dialogueBlock';
import * as Function from './function';
import * as Jump from './jump';
import * as Node from './node';
import * as Operator from './operator';
import * as Option from './option';
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

  const opCodeInfo = FileIO.ReadByte(handle, offset);
  offset += opCodeInfo.length;
  let retValue = null;
  switch(opCodeInfo.data) {
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
      retValue = Static.String(state, handle, offset, stringTable);
      break;
    case 18:
      retValue = Static.Float(state, handle, offset);
      break;
    case 82:
      retValue = Static.Int(state, handle, offset);
      break;
    case 19:
      retValue = Operator.Add(state, handle, offset);
      break;
    case 83:
      retValue = Operator.Subtract(state, handle, offset);
      break;
    case 20:
      retValue = Operator.Multiply(state, handle, offset);
      break;
    case 84:
      retValue = Operator.Divide(state, handle, offset);
      break;
    case 148:
      retValue = Operator.Modulus(state, handle, offset);
      break;
    case 21:
      retValue = Operator.Equal(state, handle, offset);
      break;
    case 85:
      retValue = Operator.Not(state, handle, offset);
      break;
    case 22:
      retValue = Operator.And(state, handle, offset);
      break;
    case 86:
      retValue = Operator.Or(state, handle, offset);
      break;
    case 150:
      retValue = Operator.Xor(state, handle, offset);
      break;
    case 23:
      retValue = Operator.GreaterThan(state, handle, offset);
      break;
    case 87:
      retValue = Operator.LessThan(state, handle, offset);
      break;
    case 24:
      retValue = Function.Return(state, handle, offset, logic);
      break;
    case 88:
      retValue = Function.NoReturn(state, handle, offset, logic);
      break;
    case 40:
      retValue = Option.Push(state, handle, offset, start);
      break;
    case 41:
      retValue = Option.Run(state);
      break;      
    case 253:
      retValue = Clear.Arguments(state, handle, offset);
      break;
    case 254:
      retValue = Clear.Options(state, handle, offset);
      break;
    default:
      retValue = { data: { external: "Unknown Opcode" } };
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

  if (retValue != null && retValue.data != null) 
    return retValue.data;
  return null;
}