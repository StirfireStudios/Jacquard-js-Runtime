'use strict';

const privates = new WeakMap();

/** 
 * We have moved to a new node
 */
export default class NodeChange {
  constructor(nodeName) {
    privates.set(this, {name: nodeName});
  }

  /** The node name we have moved to
   *  @returns {string}
   */
  get nodeName() { return privates.get(this).name; }
}