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