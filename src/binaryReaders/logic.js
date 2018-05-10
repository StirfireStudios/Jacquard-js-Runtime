'use strict';

import * as Base from './base';
import * as FileIO from '../fileIO';

const TableOrder = [
  {name: "functions", type: "stringArray"},
  {name: "characters", type: "stringArray"},
  {name: "variables", type: "stringArray"},
  {name: "strings", type: "stringArray"},
  {name: "nodes", type: "stringOffsetArray"},
  {name: "instructions", type: "offsetOnly"},
]

const privates = new WeakMap();

export default class Logic extends Base.BaseReader {
  constructor(handle) {
    super(handle);
    const priv = Base.ParseHeaderTables.call(this, TableOrder);
    console.log(priv);
    privates.set(this, priv);
  }

  get characters() { return privates.get(this).characters; }
  get functions() { return privates.get(this).functions; }
  get variables() { return privates.get(this).functions; }
  get strings() { return privates.get(this).functions; }
  get nodeNames() { return Object.keys(privates.get(this).nodes); }
}