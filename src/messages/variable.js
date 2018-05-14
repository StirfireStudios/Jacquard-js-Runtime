'use strict';

const privates = new WeakMap();

class base {
  constructor(variableName, value) {
    privates.set(this, {name: variableName, value: value});
  }

  get variableName() { return privates.get(this).name; }
  get value() { return privates.get(this).value; }
}

export class Save extends base {
  constructor(variableName, value) { super(variableName, value); }
}

export class Load extends base {
  constructor(variableName, value) { super(variableName, value); }
}