'use strict';

const privates = new WeakMap();
import createIP from '../vm/createIP';

export function handleCommand(command) {
  const message = new Options();
  const options = [];
  privates.set(message, { options: options });
  for (let entryPoint of command.options) {
    const option = createIP();
    option.logicOffset = entryPoint;
    options.push(option);
  }
  return message;
}

export function entryPointFor(option) {
  return privates.get(option).entryPoint;
}

/** 
 * There are selectable options
 */
export class Options {
  /** the Instruction Pointers for the options
   * @return {InstructionPointer[]}
   */
  get options() { return privates.get(this).options; }
}