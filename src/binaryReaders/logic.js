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
}