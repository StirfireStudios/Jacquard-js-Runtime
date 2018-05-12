import { createReducer } from 'redux-act';
import * as JacquardRuntime from '../jacquard-js-runtime'

import * as DataActions from '../actions/data';
import * as RuntimeActions from '../actions/runtime';

import handleShowText from './runtime/showText';

const runtime = new JacquardRuntime.Runtime();

function convertType(textType) {
  if (textType === 'logic') return JacquardRuntime.FileIO.Types.Logic;
  if (textType === 'dialogue') return JacquardRuntime.FileIO.Types.Dialogue;
  if (textType === 'sourceMap') return JacquardRuntime.FileIO.Types.SourceMap;

  return JacquardRuntime.FileIO.Types.Unknown;
}

function updateWithRuntimeData(state) {
  if (!runtime.ready) {
    return {
      ...state,
      ready: false,
      characters: [],
      variables: [],
      variableState: {},
      functions: [],
      nodeNames: [],
      nodeHistory: [],
      text: [],
    }
  }

  const newState = {
    ...state,
    ready: true,
    characters: runtime.characters,
    variables: runtime.variableList,
    variableState: {},
    functions: runtime.functionList,
    dialogueLoaded: runtime.dialogueLoaded,
    nodeNames: runtime.nodeNames,
    nodeHistory: runtime.nodeHistory,
  }

  if (runtime.currentMessage != null) {
    switch(runtime.currentMessage.constructor.name) {
      case "ShowText":
        handleShowText(newState, runtime.currentMessage);
        break;
    }
  }

  return newState;
}

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
    return updateWithRuntimeData(state);
  },
  [DataActions.UnloadFile]: (state, type) => {
    runtime.removeFile(convertType(type));
    return updateWithRuntimeData(state);
  },
  [RuntimeActions.Run]: (state) => {
    runtime.run();
    return updateWithRuntimeData(state);
  },
  [RuntimeActions.RunStep]: (state) => {
    runtime.run(true);
    return updateWithRuntimeData(state);
  },
}, {
  ready: false,
  active: false,
  runMode: "toOption",
  waitingFor: "start",
  characters: [],
  variables: [],
  functions: [],
  nodeNames: [],
});