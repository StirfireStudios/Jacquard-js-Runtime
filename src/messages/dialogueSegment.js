'use strict';

const privates = new WeakMap();

export function handleCommand(id, characterIndex, messages) {
  const message = new DialogueSegment();
  privates.set(message, { index: characterIndex, messages: messages, id: id });
  return message;
}

/** 
 * DialogSegment grouping
 * @name DialogueSegment
 * @kind class
 */
export class DialogueSegment {
  /**
   * The identifier of this dialogue segment
   * @memberof DialogueSegment
   * @return {string} the id
   */
  get id() { return privates.get(this).id; }

  /** @return {number} the index of the character name in the tables
   */
  get characterIndex() { return privates.get(this).index; };

  /**
   * The messages contained in this dialogue segment
   * @memberof DialogueSegment
   * @return {object[]} messages
   */
  get messages() { return privates.get(this).messages; }
}
