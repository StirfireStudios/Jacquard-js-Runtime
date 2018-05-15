'use strict';

const privates = new WeakMap();

export function handleCommand(command) {
  const message = new Command();
  privates.set(message, { args: command.args.map((item) => (item)) });
  return message;
}

/** 
 * An engine command to execute.
 * @name Command
 * @kind class
 */
export class Command {
  /**
   * The arguments of this command
   * @memberof Command
   * @return {string[]} arguments
   */
  get args() { return privates.get(this).args; }
}