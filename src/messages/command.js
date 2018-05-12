'use strict';

const privates = new WeakMap();

export function handleCommand(command) {
  debugger;
  const message = new Command();
  privates.set(message, { args: command.args.map((item) => (item)) });
  return message;
}

export class Command {
  get args() { return privates.get(this).args; }
}

export const externals = { Command }