'use strict';

const privates = new WeakMap();

export function handleCommand(command, logicNames, dialogueNames) {
  const message = new Show();
  privates.set(message, { parts: [] });
  const parts = privates.get(message).parts;
  const newPart = new ShowPart(); 
  const priv = { text: command.display, index: command.characterIndex };
  if (command.characterIndex !== -1) { 
    priv.name = logicNames[command.characterIndex];
    priv.localName = dialogueNames[command.characterIndex];
  }
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
  /** @return {string} the localized version of the character name (or null)
   */
  get localizedCharacterName() { return privates.get(this).localName; };
  /** @return {string} the engine version of the character name (or null)
   */
  get characterName() { return privates.get(this).name; };
  /** @return {number} the index of the character name in the tables
   */
  get characterIndex() { return privates.get(this).index; };
  /** @return {string} The actual text line
   */
  get text() { return privates.get(this).text; };
}
 
export const externals = { Show, ShowPart }