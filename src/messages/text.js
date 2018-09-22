'use strict';

const privates = new WeakMap();

export function handleCommand(command) {
  const message = new Show();
  privates.set(message, { parts: [] });
  const parts = privates.get(message).parts;
  const newPart = new ShowPart(); 
  const priv = { text: command.display };
  privates.set(newPart, priv);
  parts.push(newPart);
  return message;
}

/** Dialogue to display
 */
export class Show {
  /** Text portions
   * @return {ShowPart[]}
   */
  get parts() { return privates.get(this).parts; }
}

/**
 * A line spoken (optionally) by a character
 */
export class ShowPart {
  get text() { return privates.get(this).text; };
}
 
export const externals = { Show, ShowPart }
