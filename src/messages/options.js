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
  }
  return message;
}

export function entryPointFor(option) {
  return privates.get(option).entryPoint;
}

export class Options {
  get options() { return privates.get(this).options; }
}

export const externals = { Options }