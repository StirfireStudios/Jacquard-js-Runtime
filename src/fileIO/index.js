'use strict';

import * as FileAPI from './fileAPI';

const subTypes = [FileAPI];

function unknownFileType() {
  return new Promise((resolve, reject) => {
    setTimeout(() => { reject("Unknown file type"); }, 0);
  });
}

/** FileIO operations
 * @name FileIO
 */

/** 
 * A handle to file data.
 * @name FileIO.handle
 * @memberof FileIO
 * @kind object
 */

/**
 * Open some file data (currently the browser File API is supported) for later use
 * @name FileIO.Open
 * @memberof FileIO
 * @param {*} fileInput the file data to use as input
 * @returns {Promise} a promise that either returns the file stream {FileIO.handle} or an error
 */
export function Open(fileInput) {
  for(let subType of subTypes) {
    if (subType.canUse(fileInput)) return subType.open(fileInput);
  }

  return unknownFileType(); 
}

/** 
 * Get type of a file stream
 * @memberof FileIO
 * @name FileIO.Type
 * @param {FileIO.handle} handle 
 * @returns {FileIO.Types} file type
 */
export function Type(handle) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.fileType(handle);
  }
}

export function ReadByte(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readByte(handle, offset);
  }
  
  return -1;  
}

export function ReadFloat(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readFloat(handle, offset);
  }
  
  return -1;  
}

export function ReadVarInt(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readVarInt(handle, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadVarBytes(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readVarBytes(handle, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadVarString(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readVarString(handle, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadStringTable(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readStringTable(handle, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadStringOffsetTable(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readStringOffsetTable(handle, offset);
  }
  
  return {length: -1, data: null};
}

export function ReadByteOffsetTable(handle, offset) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.readByteOffsetTable(handle, offset);
  }
  
  return {length: -1, data: null};
}

export function GetLength(handle) {
  for(let subType of subTypes) {
    if (subType.isType(handle)) return subType.getLength(handle);
  }
  
  return -1;
}

export {default as Types} from './types'