'use strict';

import * as FileAPI from './fileAPI';

function unknownFileType() {
  return new Promise((resolve, reject) => {
    setTimeout(() => { reject("Unknown file type"); }, 0);
  });
}

export function openFile(fileInput) {
  if (FileAPI.canUse(fileInput)) return FileAPI.open(fileInput);

  return unknownFileType(); 
}

export function seek(stream) {

}
