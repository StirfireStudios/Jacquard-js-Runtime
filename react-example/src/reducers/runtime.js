import { createReducer } from 'redux-act';
import * as JacquardRuntime from '../jacquard-js-runtime'

import * as DataActions from '../actions/data';
import * as RuntimeActions from '../actions/runtime';

import handleShowText from './runtimeHandlers/showText';
import handleCommand from './runtimeHandlers/command';
import handleOptions from './runtimeHandlers/options';

const runtime = new JacquardRuntime.Runtime();

function convertType(textType) {
  if (textType === 'logic') return JacquardRuntime.FileIO.Types.Logic;
  if (textType === 'dialogue') return JacquardRuntime.FileIO.Types.Dialogue;
  if (textType === 'sourceMap') return JacquardRuntime.FileIO.Types.SourceMap;

  return JacquardRuntime.FileIO.Types.Unknown;
}

function updateWithRuntimeData(state, runMode) {
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
    runMode: runMode != null ? runMode : state.runMode,
    ready: true,
    options: state.options != null ? state.options.map((item) => (item)) : null,
    text: state.text.map((item) => (item)),
  };
   
  let keepRunning = newState.ready && newState.runMode != null;
  keepRunning = keepRunning && newState.options == null;
  while(keepRunning) {
    keepRunning = runMode !== "step";
    runtime.run(runMode === "step");
    if (runtime.currentMessage != null) {
      switch(runtime.currentMessage.constructor.name) {
        case "ShowText":
          handleShowText(newState.text, runtime.currentMessage);
          break;
        case "Command":
          handleCommand(newState.text, runtime.currentMessage);
          keepRunning = keepRunning && newState.runState !== "toCommand";
          break;
        case "Options":
          handleOptions(newState, runtime.currentMessage, runtime);
          keepRunning = false;
          break;
        case "EndOfFile": 
          keepRunning = false;
        default:
          break;
      }
    }
  }

  newState.characters = runtime.characters;
  newState.variables = runtime.variableList;
  newState.variableState = runtime.variables;
  newState.functions = runtime.functionList;
  newState.dialogueLoaded = runtime.dialogueLoaded;
  newState.nodeNames = runtime.nodeNames;
  newState.nodeHistory = runtime.nodeHistory;

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
    return updateWithRuntimeData(state, "toOption");
  },
  [RuntimeActions.RunStep]: (state) => {
    return updateWithRuntimeData(state, "step");
  },
  [RuntimeActions.OptionSelect]: (state, option) => {
    state.options = null;
    state.text.push(`-> Selected ${option.text}`);
    runtime.moveInstructionPointerTo(option.data);
    return updateWithRuntimeData(state, state.runMode);
  },
  [RuntimeActions.MoveToNode]: (state, nodeName) => {
    if (runtime.moveInstructionPointerToNode(nodeName)) {
      state.options = null;
      state.text = [];
      return updateWithRuntimeData(state);  
    } else {
      return state;
    }
  },
}, {
  ready: false,
  active: false,
  runMode: null,
  options: null,
  characters: [],
  variables: [],
  functions: [],
  nodeNames: [],
});