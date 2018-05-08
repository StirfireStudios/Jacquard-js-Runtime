import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import React, { Component } from 'react';
import ReactFileReader  from 'react-file-reader';

import * as DataActions from '../actions/data'
import * as DataAsync from '../actionsAsync/data';

function onFileSelect(files) {
  for(let file of files) DataAsync.LoadFile(file);
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

class LoadFiles extends Component {
  render() {
    return (
      <div>
        {renderFileState.call(this)}
        {renderUploadButton.call(this)}
      </div>
    )
  }
} 

function mapStateToProps(state) {
  const fileStates = {};
  for(let fileName of state.Data.outstandingLoads) fileStates[fileName] = true;
  for(let fileName of Object.keys(state.Data.errors)) fileStates[fileName] = state.Data.errors[fileName];

  return {
    busy: state.Data.outstandingLoads.length > 0,
    fileStates: fileStates,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DataActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadFiles);