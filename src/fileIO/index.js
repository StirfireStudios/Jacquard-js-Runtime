'use strict';

import * as FileAPI from './fileAPI';

const subTypes = [FileAPI];

function unknownFileType() {
  return new Promise((resolve, reject) => {
    setTimeout(() => { reject("Unknown file type"); }, 0);
  });
}

export function Open(fileInput) {
  for(let subType of subTypes) {
    if (subType.canUse(fileInput)) return subType.open(fileInput);
  }

  return unknownFileType(); 
}

export function Type(stream) {
  for(let subType of subTypes) {
    if (subType.isType(stream)) return subType.fileType(stream);
  }
}

export function ReadVarInt(stream, offset) {
  for(let subType of subTypes) {
    if (subType.isType(stream)) return subType.readVarInt(stream, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadVarString(stream, offset) {
  for(let subType of subTypes) {
    if (subType.isType(stream)) return subType.readVarString(stream, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadStringTable(stream, offset) {
  for(let subType of subTypes) {
    if (subType.isType(stream)) return subType.readStringTable(stream, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadStringOffsetTable(stream, offset) {
  for(let subType of subTypes) {
    if (subType.isType(stream)) return subType.readStringOffsetTable(stream, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadByteOffsetTable(stream, offset) {
  for(let subType of subTypes) {
    if (subType.isType(stream)) return subType.readByteOffsetTable(stream, offset);
  }
  
  return {length: -1, data: null};
}

export {default as Types} from './types'