import { createReducer } from 'redux-act';
import { FileIO, Messages, Runtime } from '../jacquard-js-runtime'

import * as DataActions from '../actions/data';
import * as RuntimeActions from '../actions/runtime';

import handleShowText from './runtimeHandlers/showText';
import handleCommand from './runtimeHandlers/command';
import handleFunction from './runtimeHandlers/function';
import handleOptions from './runtimeHandlers/options';
import handleNodeChange from './runtimeHandlers/nodeChange';
import handleVariable from './runtimeHandlers/variable';

const runtime = new Runtime();

function convertType(textType) {
  if (textType === 'logic') return FileIO.Types.Logic;
  if (textType === 'dialogue') return FileIO.Types.Dialogue;
  if (textType === 'sourceMap') return FileIO.Types.SourceMap;

  return FileIO.Types.Unknown;
}

function updateWithRuntimeData(state, runMode, returnedFuncObj) {
  if (!runtime.ready) {
    return {
      ...state,
      ready: false,
      characters: [],
      variables: [],
      variableState: {},
      functions: [],
      currentFunc: null,
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
   
  if (returnedFuncObj != null) newState.text.push({function: returnedFuncObj});

  let keepRunning = newState.ready && newState.runMode != null;
  keepRunning = keepRunning && newState.options == null && newState.currentFunc == null;
  while(keepRunning) {
    keepRunning = runMode !== "step";
    const message = runtime.run(runMode === "step");
    if (message != null) {
      switch(message.constructor) {
        case Messages.NodeChange:
          handleNodeChange(newState.text, message);
          break;
        case Messages.Text.Show:
          handleShowText(newState.text, message);
          break;
        case Messages.Command:
          handleCommand(newState.text, message);
          keepRunning = keepRunning && newState.runState !== "toCommand";
          break;
        case Messages.Options:
          handleOptions(newState, message, runtime);
          keepRunning = false;
          break;
        case Messages.EndOfFile:
          keepRunning = false; // eslint-disable-next-line
        case Messages.Variable.Save: 
        case Messages.Variable.Load:
          handleVariable(newState.text, message);
          break;  
        case Messages.Halt: 
          newState.text.push({halted: true});
          newState.halted = true;
          keepRunning = false;
          break;
        case Messages.Function:
          if (handleFunction(newState, message)) keepRunning = false; 
          break;
        default:
          console.log("Got message:");
          console.log(message);
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
    state.text.push({optionSelected: option});
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
  [RuntimeActions.FuncValue]: (state, value) => {
    if (value.toLowerCase() === 'true') {
      value = true;
    } else if (value.toLowerCase() === 'false') {
      value = false;
    } else if (parseInt(value, 10).toString() === value) {
      value = parseInt(value, 10);
    } else if (parseFloat(value).toString() === value) {
      value = parseFloat(value);
    }
    state.currentFunc.returnValue = value;
    const returnFuncObj = state.currentFunc;
    state.currentFunc = null;
    runtime.functionReturnValue(value);
    return updateWithRuntimeData(state, state.runMode, returnFuncObj);
  },
}, {
  ready: false,
  active: false,
  runMode: null,
  options: null,
  currentFunc: null,
  characters: [],
  variables: [],
  functions: [],
  nodeNames: [],
  halted: false,
});
