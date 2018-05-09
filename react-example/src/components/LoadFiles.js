import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import React, { Component } from 'react';
import ReactFileReader  from 'react-file-reader';

import * as DataActions from '../actions/data'
import * as DataAsync from '../actionsAsync/data';

function onFileSelect(files) {
  for(let file of files) DataAsync.LoadFile(file);
}

function onRun() {
  console.log("run!");
}

function renderFileState() {
  const fileStates = [];
  for(let fileName of Object.keys(this.props.fileStates)) {
    let message = "Loading...";
    if (this.props.fileStates[fileName] !== true) {
      message = `Error: ${this.props.fileStates[fileName]}`;
    }
    fileStates.push(
      <div key={fileName}>{fileName} - {message}</div>
    );
  }
  return (
    <div>
      {fileStates}
    </div>
  );
}

function renderUploadButton() {
  if (this.props.busy) return <div>Loading...</div>;
  const handleFiles = onFileSelect.bind(this);
  const types = [".jqrdd", ".jqrdl", ".jqrd.sourcemap"];
  return (
    <div>
      <ReactFileReader 
        fileTypes={types}
        handleFiles={handleFiles}
        multipleFiles={true}
      >
        <button>Upload</button>
      </ReactFileReader >
    </div>
  );
}

function renderReadyButton() {
  if (!this.props.ready) return <div>Not Ready</div>;
  const filenames = [];
  filenames.push(<div key="logic">
    <label>Logic File:</label><span>{this.props.logicFile}</span>
    </div>
  );
  filenames.push(<div key="dialogue">
    <label>Dialogue File:</label><span>{this.props.dialogueFile}</span>
    </div>
  );
  if (this.props.sourceMapFile != null) {
    filenames.push(<div key="sourceMap">
      <label>SourceMap File:</label><span>{this.props.sourceMapFile}</span>
      </div>
    );  
  }

  return (
    <div>
      {filenames}
      <button onClick={onRun.bind(this)}>Run</button>
    </div>  
  );
}

class LoadFiles extends Component {
  render() {
    return (
      <div>
        {renderFileState.call(this)}
        {renderUploadButton.call(this)}
        {renderReadyButton.call(this)}
      </div>
    )
  }
} 

function mapStateToProps(state) {
  const busy = state.Data.outstandingLoads.length > 0;
  const ready = state.Data.logic != null && state.Data.dialogue != null && !busy;
  const fileStates = {};

  for(let fileName of state.Data.outstandingLoads) fileStates[fileName] = true;
  for(let fileName of Object.keys(state.Data.errors)) fileStates[fileName] = state.Data.errors[fileName];

  return {
    busy: busy,
    fileStates: fileStates,
    ready: ready,
    logicFile: state.Data.logic != null ? state.Data.logic.fileName : null,
    dialogueFile: state.Data.dialogue != null ? state.Data.dialogue.fileName : null,
    sourceMapFile: state.Data.sourceMap != null ? state.Data.sourceMap.fileName : null,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DataActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadFiles);