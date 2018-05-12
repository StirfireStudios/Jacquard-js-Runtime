'use strict';

const privates = new WeakMap();

export function handleCommand(message, command, logicNames, dialogueNames) {
  if (message != null && !(message instanceof ShowText)) {
    throw new Error("supplied message isn't of type ShowText");
    return;
  }
  
  if (message == null) {
    message = new ShowText();
    privates.set(message, { parts: [] });
  }
  const parts = privates.get(message).parts;
  const newPart = new ShowTextPart(); 
  const priv = { text: command.display, index: command.characterIndex };
  if (command.characterIndex !== -1) { 
    priv.name = logicNames[command.characterIndex];
    priv.localName = dialogueNames[command.characterIndex];
  }
  privates.set(newPart, priv);
  parts.push(newPart);
  return message;
}

export class ShowText {
  get parts() { return privates.get(this).parts; }
}

export class ShowTextPart {
  get localizedCharacterName() { return privates.get(this).localName; };
  get characterName() { return privates.get(this).name; };
  get characterIndex() { return privates.get(this).index; };
  get text() { return privates.get(this).text; };
}
 
export const externals = { ShowText, ShowTextPart }