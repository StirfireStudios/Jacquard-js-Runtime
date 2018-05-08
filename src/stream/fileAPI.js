'use strict';

const usable = File !== undefined;

export function canUse(fileInput) {
  if (!usable) return false;
  return (fileInput instanceof File);
}

export function open(fileInput) {
  return new Promise((resolve, reject) => {
    const streamInfo = {type: "fileAPI"};
    reject("error!");
  });
}
