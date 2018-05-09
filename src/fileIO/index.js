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

export {default as Types} from './types'