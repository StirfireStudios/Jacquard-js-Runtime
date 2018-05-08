'use strict';

const canUseFileAPI = File !== undefined

function openWithFileAPI(fileInput) {
  const streamInfo = { type: 'fileAPI' }
}

export function openFile(fileinput) {
  return new Promise((resolve, reject) => {
    if (canUseFileApi) {
      return openWithFileAPI(fileInput);
    }      
  });
}

export function seek(stream) {

}