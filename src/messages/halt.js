'use strict';

const privates = new WeakMap();

export default class Halt {
  constructor(message) {
    privates.set(this, {message: message});
  }

  get message() { return privates.get(this).message; }
}