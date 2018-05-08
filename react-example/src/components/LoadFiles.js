import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import React, { Component } from 'react';
import ReactFileReader  from 'react-file-reader';

import * as DataActions from '../actions/data'
import * as DataAsync from '../actionsAsync/data';

function onFileSelect(files) {
  for(let file of files) DataAsync.LoadFile(file);
}

function renderLoadingProgress() {
  const filenames = this.props.fileNames.map((name) => {
    return <div key={name}>{name} - loading...</div>;
  });

  return (
    <div>
      {filenames}
    </div>
  );
}

function renderUploadButton() {
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
    if (this.props.busy) {
      return renderLoadingProgress.call(this);
    } else {
      return renderUploadButton.call(this);
    }
  }
} 

function mapStateToProps(state) {
  return {
    busy: state.Data.outstandingLoads.length > 0,
    fileNames: state.Data.outstandingLoads,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DataActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadFiles);