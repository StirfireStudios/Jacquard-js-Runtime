'use strict';

import * as FileIO from '../fileIO';

const privates = new WeakMap();

export function ParseHeaderTables(TableOrder, offset) {
  const priv = privates.get(this);
  const retVal = {};

  if (offset == null) offset = priv.offset;

  retVal.startOffset = offset;
  for(let table of TableOrder) {
    const tableOffset = FileIO.ReadVarInt(priv.handle, offset);
    offset += tableOffset.length;
    switch(table.type) {
      case "stringArray":
        retVal[table.name] = FileIO.ReadStringTable(priv.handle,  tableOffset.data).data;
        break;
      case "stringOffsetArray":
        retVal[table.name] = FileIO.ReadStringOffsetTable(priv.handle,  tableOffset.data).data;
        break;
      case "byteOffsetArray":
        retVal[table.name] = FileIO.ReadByteOffsetTable(priv.handle,  tableOffset.data).data;
        break;      
      default:
        retVal[table.name] = tableOffset.data;
    }
  }

  return retVal;
}

export function GetOffset() {
  return privates.get(this).offset;
}

export function SetOffset(value) {
  const priv = privates.get(this);
  priv.offset = value;
}

export class BaseReader {
  constructor(handle) {
    const versionInfo = FileIO.ReadVarString(handle, 5);

    const priv = {
      handle: handle,
      version: versionInfo.data,
      offset: 5 + versionInfo.length,
    }

    privates.set(this, priv);
  }

  get version() { return privates.get(this).version; }
}