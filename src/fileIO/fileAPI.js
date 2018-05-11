'use strict';

import UTF8 from 'utf-8';

import Types from './types';

const usable = File !== undefined;

function loadSourceMap(tempArray) {
  try {
    const jsonString = UTF8.getStringFromBytes(tempArray);
    const jsonData = JSON.parse(jsonString);
    if (jsonData.logic != null && jsonData.dialog != null) {
      this.type = Types.SourceMap;
      this.logic = jsonData.logic;
      this.dialogue = jsonData.dialog;
      return;
    }
  } catch(error) {
    return;
  }
}

function ready(arrayBuffer) {
  if (this.length < 20) return;
  const tempArray = new Uint8ClampedArray(arrayBuffer);
  const typeString = UTF8.getStringFromBytes(tempArray, 0, 5);
  if (typeString === "JQRDD") {
    this.type = Types.Dialogue;
    this.buffer = tempArray;
  } else if (typeString === "JQRDL") {
    this.type = Types.Logic;
    this.buffer = tempArray;
  } else if (typeString.startsWith("{\"")) {
    loadSourceMap.call(this, tempArray);
    return;
  }
}

export function canUse(fileInput) {
  if (!usable) return false;
  return (fileInput instanceof File);
}

export function isType(stream) {
  if (typeof(stream) !== 'object') return false;
  return stream.api === 'fileAPI';
}

export function open(fileInput) {
  return new Promise((resolve, reject) => {
    const streamInfo = {
      api: "fileAPI",
      length: fileInput.size,
      type: Types.Unknown,
    };
    const reader = new FileReader();
    reader.onload = (event) => {
      ready.call(streamInfo, event.target.result);
      resolve(streamInfo);
    }
    reader.onerror = (event) => {
      reject(event);
    }
    reader.readAsArrayBuffer(fileInput);
  });
}

export function fileType(stream) {
  return stream.type;
}

export function readByte(stream, offset) {
  return {data: stream.buffer[offset], length: 1}
}

export function readFloat(stream, offset) {
  const view = new Float32Array(stream.buffer.buffer, offset, 4);
  return {data:view[0], length: 4};
}

export function readVarInt(stream, offset) {
  let intLength = stream.buffer[offset];
  if (intLength === 0 || intLength === 128) {
    return { data: 0, length: 1 };
  }

  let negative = false;
  if (intLength > 128) {
    negative = true;
    intLength = intLength - 128;
  }

  let number = 0;
  for(let position = 0; position < intLength; position++) {
    const byte = stream.buffer[offset + position + 1];
    number += byte * Math.pow(256, position);
  }

  if (negative) number = number * -1;

  return { data: number, length: 1 + intLength};
}

export function readVarString(stream, offset) {
  const lengthInfo = readVarInt(stream, offset);
  if (lengthInfo.data == null) return lengthInfo;
  const start = offset + lengthInfo.length;
  const length = lengthInfo.data;
  const string = UTF8.getStringFromBytes(stream.buffer, start, length + start);

  return {
    length: lengthInfo.length + length,
    data: string,
  }
}

export function readVarBytes(stream, offset) {
  const lengthInfo = readVarInt(stream, offset);
  if (lengthInfo.data == null) return lengthInfo;
  const start = offset + lengthInfo.length;
  const length = lengthInfo.data;
  const bytes = stream.buffer.slice(start, length + start);
  return {
    length: lengthInfo.length + length,
    data: bytes,
  }
}

export function readStringTable(stream, offset) {
  if (offset === 0) { return {length: 0, data: []}; }
  let length = 0;
  const entriesInfo = readVarInt(stream, offset);
  if (entriesInfo.data == null) return entriesInfo;
  offset += entriesInfo.length;
  length += entriesInfo.length;
  const array = [];
  for(let index = 0; index < entriesInfo.data; index++) {
    const entryInfo = readVarString(stream, offset);
    array.push(entryInfo.data);
    offset += entryInfo.length;
    length += entriesInfo.length;
  }
  return {length: length, data: array};
}

export function readStringOffsetTable(stream, offset) {
  if (offset === 0) { return {length: 0, data: []}; }
  let length = 0;
  const entriesInfo = readVarInt(stream, offset);
  if (entriesInfo.data == null) return entriesInfo;
  offset += entriesInfo.length;
  length += entriesInfo.length;
  const data = {};
  for(let index = 0; index < entriesInfo.data; index++) {
    const keyInfo = readVarString(stream, offset);
    offset += keyInfo.length;
    length += keyInfo.length;
    const valInfo = readVarInt(stream, offset);
    offset += valInfo.length;
    length += valInfo.length;
    data[keyInfo.data] = valInfo.data; 
  }

  return {length: length, data: data};
}

function byteKeyFor(stream, offset) {
  const data = readVarBytes(stream, offset);
  return {
    length: data.length,
    data: Array.from(data.data, (byte) => { return ('0' + (byte & 0xFF).toString(16)).slice(-2); }).join('')
  }
}

export function readByteOffsetTable(stream, offset) {
  if (offset === 0) { return {length: 0, data: []}; }
  let length = 0;
  const entriesInfo = readVarInt(stream, offset);
  if (entriesInfo.data == null) return entriesInfo;
  offset += entriesInfo.length;
  length += entriesInfo.length;
  const data = {};
  for(let index = 0; index < entriesInfo.data; index++) {
    const keyInfo = byteKeyFor(stream, offset);
    offset += keyInfo.length;
    length += keyInfo.length;
    const valInfo = readVarInt(stream, offset);
    offset += valInfo.length;
    length += valInfo.length;
    data[keyInfo.data] = valInfo.data; 
  }  

  return {length: length, data: data};
}