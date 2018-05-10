'use strict';

import * as FileIO from '../fileIO';

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
    case 1: // ShowText
      retValue = { 
        external: "showText",
        value: state.args.join(""),
        characterIndex: state.characterIndex,
      }
      break;
    case 65: // Run Command
      retValue = { external: "runCommand", value: state.args }
      break;
    case 129: { // Show Dialogue Block
        const blockIDInfo = FileIO.ReadVarBytes(handle, offset);
        offset += blockIDInfo.length;
        const characterIndexInfo = FileIO.ReadVarInt(handle, offset);
        offset += characterIndexInfo.length;
        state.characterIndex = characterIndexInfo.data;
        state.dialogueOffset = dialogue.offsetForSegment(blockIDInfo.data);
      }
      break;
    case 193: // Dialog Block End
      offset = -1;
      break;
    case 2: {// Node entry
        const nodeIndexInfo = FileIO.ReadVarInt(handle, offset);
        offset += nodeIndexInfo.length;
        retValue = { enterNode: nodeIndexInfo.data };
      }
      break;
    case 3: // jump
    case 67: // jumpIfTrue
    case 131: {// jumpIfFalse
        const newOffset = FileIO.ReadVarInt(handle, offset);
        if (opcode = 3) { offset = newOffset + start; break; }
        if (opCode === 67 && state.args.pop()) { offset = newOffset + start; break; }
        if (opCode === 131 && !state.args.pop()) { offset = newOffset + start; break; }
        offset += newOffset.length;
      }
      break;
    case 10: // VariableLoad
    case 144: {// VariableSet
        const varIndex = FileIO.ReadVarInt(handle, offset);
        const varName = logic.variables[varIndex.data];
        if (opcode == 10) { state.args.push(state.variables[varName]); }
        if (opcode == 90) { state.variables[varName] = state.args[state.args.length - 1]; }
      }
      break;
    case 11: {// VariableSet
        const varIndex = FileIO.ReadVarInt(handle, offset);
        const varName = logic.variables[varIndex.data];
        if (opcode == 10) { state.args.push(state.variables[varName]); }
        if (opcode == 90) { state.variables[varName] = state.args[state.args.length - 1]; }
      }
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
    case 209: {// Static String
        const stringIndex = FileIO.ReadVarInt(handle, offset);
        offset += stringIndex.length;
        state.args.push(stringTable[stringIndex.data]);
      }
      break;
    case 18: {// Static Float
        const floatInfo = FileIO.ReadFloat(handle, offset);
        offset += floatInfo.length;
        state.args.push(floatInfo.data);
      }
      break;
    case 82: {// Static Int
        const intInfo = FileIO.ReadVarInt(handle, offset);
        offset += intInfo.length;
        state.args.push(intInfo.data);
      }
      break;
    default:
      retValue = { external: "Unknown Opcode" };
  }

  if (inDialogue) {
    state.dialogueOffset = offset - start;
  } else {
    state.logicOffset = offset - start;
  }

  return retValue;
}