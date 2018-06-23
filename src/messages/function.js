'use strict';

const privates = new WeakMap();

export function handleCommand(command) {
  const message = new Function();
  privates.set(message, { 
    name: command.function.name,
    index: command.function.index,
    args: command.function.args.map((item) => (item)),
    returnValue: command.function.returnValue,
    returnRequired: command.function.return,
  });
  return message;
}

/** 
 * A function to run.
 * @name Function
 * @kind class
 */
export class Function {
  /**
   * The name of the function to run
   * @memberof Function
   * @return {string} name
   */
  get name() { return privates.get(this).name; }

  /**
   * The index of the function to run
   * @memberof Function
   * @return {number} name
   */
  get index() { return privates.get(this).index; }

  /**
   * The arguments of this command
   * @memberof Function
   * @return {any[]} arguments (could be of any type)
   */
  get args() { return privates.get(this).args; }

  /**
   * If this function already has a value that was applied 
   * (usually means the function was "Visited")
   */
  get returnValue() { return privates.get(this).returnValue; }

  /**
   * If this function requires a value to be provided to the runtime
   */
  get returnRequired() { return privates.get(this).returnRequired; }
}
