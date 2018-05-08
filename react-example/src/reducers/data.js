import { createReducer } from 'redux-act';
import JacquardRuntime from '../jacquard-js-runtime'

import * as DataActions from '../actions/data';

export default createReducer({
  [DataActions.LoadStarted]: (state, filename) => {
    const newOutstanding = state.outstandingLoads.map((item) => (item));
    newOutstanding.push(filename);
  return {
    ...state,
    outstandingLoads: newOutstanding,
  }},
  [DataActions.LogicLoaded]: (state, stream) => ({
    ...state,
    outstandingLoads: state.outstandingLoads - 1,
    logicStream: stream,
  }),
  [DataActions.DialogueLoaded]: (state, stream) => ({
    ...state,
    outstandingLoads: state.outstandingLoads - 1,
    dialogStream: stream,
  }),
  [DataActions.SourceMapLoaded]: (state, stream) => ({
    ...state,
    outstandingLoads: state.outstandingLoads - 1,
    sourceMapStream: stream,
  }),
  [DataActions.SourceMapLoaded]: (state, stream) => ({
    ...state,
    outstandingLoads: state.outstandingLoads - 1,
    sourceMapStream: stream,
  }),
}, {
  outstandingLoads: [],
  logicStream: null,
  dialogStream: null,
  sourceMapStream: null,
  error: null,
});