import { createReducer } from 'redux-act';

import * as DataActions from '../actions/data';

function dupeArray(array) {
  return array.map((item) => (item));
}

function filterArray(array, removeItem) {
  return array.filter((item) => (item !== removeItem));
}

export default createReducer({
  [DataActions.LoadStarted]: (state, filename) => {
    const newOutstanding = dupeArray(state.outstandingLoads);
    newOutstanding.push(filename);
    const newErrors = Object.assign({}, state.errors);
    delete(newErrors[filename]);
    return {
      ...state,
      outstandingLoads: newOutstanding,
    }
  },
  [DataActions.LogicLoaded]: (state, data) => {
    const newOutstanding = filterArray(state.outstandingLoads, data.fileName);
    return {
      ...state,
      outstandingLoads: newOutstanding,
      logicStream: data.stream,
    }
  },
  [DataActions.DialogueLoaded]: (state, data) => {
    const newOutstanding = filterArray(state.outstandingLoads, data.fileName);
    return {
      ...state,
      outstandingLoads: newOutstanding,
      logicStream: data.stream,
    }
  },
  [DataActions.SourceMapLoaded]: (state, data) => {
    const newOutstanding = filterArray(state.outstandingLoads, data.fileName);
    return {
      ...state,
      outstandingLoads: newOutstanding,
      logicStream: data.stream,
    }
  },
  [DataActions.ErrorLoading]: (state, data) => {
    const newOutstanding = filterArray(state.outstandingLoads, data.fileName);
    const newErrors = Object.assign({}, state.errors);
    newErrors[data.fileName] = data.error;
    return {
      ...state,
      outstandingLoads: newOutstanding,
      errors: newErrors,
    }
  },
}, {
  outstandingLoads: [],
  logicStream: null,
  dialogStream: null,
  sourceMapStream: null,
  errors: {},
});