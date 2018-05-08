import * as DataActions from '../actions/data';

import * as Stream from '../jacquard-js-runtime/stream';

export function LoadFile(file) {
  DataActions.LoadStarted(file.name);
  Stream.openFile(file).then((stream) => {
    console.log("Stream Open!");
    console.log(stream);
    // now see what file type it is.
  }).catch((error) => {
    console.log(error);
    if (error != null) {
      DataActions.ErrorLoading(file.name, error);
      return;
    }    
  });
}