import { createReducer } from 'redux-act';
import JacquardRuntime from '../jacquard-js-runtime'
import * as FileIO from '../jacquard-js-runtime/fileIO';

import * as DataActions from '../actions/data';
import * as RuntimeActions from '../actions/runtime';


function convertType(textType) {
  if (textType === 'logic') return FileIO.Types.Logic;
  if (textType === 'dialogue') return FileIO.Types.Dialogue;
  if (textType === 'sourceMap') return FileIO.Types.SourceMap;

  return FileIO.Types.Unknown;
}

const runtime = new JacquardRuntime();

export default createReducer({
  [RuntimeActions.Activate]: (state) => ({
	  ...state,
	  active: state.ready,
	}),
  [RuntimeActions.Deactivate]: (state) => ({
	  ...state,
	  active: false,
	}),
  [DataActions.LoadComplete]: (state, data) => {
    runtime.loadFile(data.handle);

    return {
      ...state,
      ready: runtime.ready,
    }
  },
  [DataActions.UnloadFile]: (state, type) => {
    runtime.removeFile(convertType(type));
    return {
      ...state,
      ready: runtime.ready,
    }
  },
}, {
  ready: false,
  active: false,
});