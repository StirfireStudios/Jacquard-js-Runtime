'use strict';

const privates = new WeakMap();

export default class NodeChange {
  constructor(nodeName) {
    privates.set(this, {name: nodeName});
  }

  get nodeName() { return privates.get(this).name; }
}