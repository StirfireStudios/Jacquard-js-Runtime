'use strict';

import * as FileIO from '../fileIO';

import createIP from './createIP';
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

export { createIP };

export function execute(state, ipState, logic, dialogue) {
  let start = logic.instructionStart;
  let offset = ipState.logicOffset + logic.instructionStart;
  let handle = logic.handle;
  let stringTable = logic.strings;
  let inDialogue = ipState.dialogueOffset !== -1
  if (inDialogue) {
    start = dialogue.instructionStart;
    stringTable = dialogue.strings;
    offset = ipState.dialogueOffset + dialogue.instructionStart;
    handle = dialogue.handle;
  }

  const opCodeInfo = FileIO.ReadByte(handle, offset);
  //console.log(`Opcode: ${opCodeInfo.data.toString(16)} offset: ${offset}, dialogue: ${inDialogue}`);
  offset += opCodeInfo.length;
  let retValue = null;
  switch(opCodeInfo.data) {
    case 0: // Noop
      break;
    case 1:
      retValue = Text.Show(state, ipState);
      break;
    case 65:
      retValue = Command.Run(ipState);
      break;
    case 129:
      retValue = DialogueBlock.Show(state, ipState, handle, offset, dialogue);
      break;
    case 193: // Dialog Block End
      offset = -1;
      break;
    case 2:
      retValue = Node.Entry(handle, offset);
      break;
    case 3:
      retValue = Jump.Unconditional(handle, offset);
      break;
    case 67:
      retValue = Jump.IfTrue(ipState, handle, offset);
      break;
    case 131:
      retValue = Jump.IfFalse(ipState, handle, offset);
      break;
    case 16: 
      retValue = Variable.Load(handle, offset, logic);
      break;
    case 144:
      retValue = Variable.Set(state, ipState, handle, offset, logic);
      break;
    case 17: // Static Null
      ipState.args.push(null);
      break;
    case 81: // Static True
      ipState.args.push(true);
      break;
    case 145: // Static false
      ipState.args.push(false);
      break;
    case 209: 
      retValue = Static.String(ipState, handle, offset, stringTable);
      break;
    case 18:
      retValue = Static.Float(ipState, handle, offset);
      break;
    case 82:
      retValue = Static.Int(ipState, handle, offset);
      break;
    case 19:
      retValue = Operator.Add(ipState, handle, offset);
      break;
    case 83:
      retValue = Operator.Subtract(ipState, handle, offset);
      break;
    case 20:
      retValue = Operator.Multiply(ipState, handle, offset);
      break;
    case 84:
      retValue = Operator.Divide(ipState, handle, offset);
      break;
    case 148:
      retValue = Operator.Modulus(ipState, handle, offset);
      break;
    case 21:
      retValue = Operator.Equal(ipState, handle, offset);
      break;
    case 85:
      retValue = Operator.Not(ipState, handle, offset);
      break;
    case 22:
      retValue = Operator.And(ipState, handle, offset);
      break;
    case 86:
      retValue = Operator.Or(ipState, handle, offset);
      break;
    case 150:
      retValue = Operator.Xor(ipState, handle, offset);
      break;
    case 23:
      retValue = Operator.GreaterThan(ipState, handle, offset);
      break;
    case 87:
      retValue = Operator.LessThan(ipState, handle, offset);
      break;
    case 24:
      retValue = Function.Return(ipState, handle, offset, logic);
      break;
    case 88:
      retValue = Function.NoReturn(ipState, handle, offset, logic);
      break;
    case 40:
      retValue = Option.Push(ipState, handle, offset, start);
      break;
    case 41:
      retValue = Option.Run(ipState);
      break;      
    case 253:
      retValue = Clear.Arguments(ipState, handle, offset);
      break;
    case 254:
      retValue = Clear.Options(ipState, handle, offset);
      break;
    default:
      retValue = { data: { external: "Unknown Opcode" } };
  }

  if (retValue != null && retValue.length) offset += retValue.length;
  if (retValue != null && retValue.offset) offset = retValue.offset + start;

  if (inDialogue) {
    if (offset == -1) {
      ipState.dialogueOffset = -1;
    } else {
      ipState.dialogueOffset = offset - start;
    }
  } else {
    ipState.logicOffset = offset - start;
  }

  if (retValue != null && retValue.data != null) 
    return retValue.data;
  return null;
}