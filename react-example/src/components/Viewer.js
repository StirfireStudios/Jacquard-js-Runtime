import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import React, { Component } from 'react';

import * as Actions from '../actions/view';

function onClick(key, show, event) {
  this.props.actions.ChangeVisibility(key, show);
  event.preventDefault();
}

function renderLists() {
  const output = [];
  if (this.props.showCharacters) {
    output.push(<div className="characters" key="characters">Character List!</div>);
  }
  
  if (this.props.showState) {
    output.push(<div className="state" key="state">Varible State List!</div>);
  }
  
  if (this.props.showVariables) {
    output.push(<div className="variables" key="variables">All Variable List!</div>);
  }  

  if (this.props.showNodeNames) {
    output.push(<div className="node" key="node">All Node Names</div>);
  }

  if (this.props.showNodeHistory) {
    output.push(<div className="nodeHistory" key="nodeHistory">Node History</div>);
  }

  return <div class="lists" key="lists">{output}</div>;
}

function renderTextWindow() {
  return <div key="display" class="display"></div>;
}

function renderButton(key) {
  const visible = this.props[`show${key}`];
  const text = visible ? "Hide" : "Show";
  const func = onClick.bind(this, key, !visible);
  return <button key={key} onClick={func} className={key.toLowerCase()}>{text} {key}</button>;
}

function renderButtons() {
  const output = [];

  ["Characters", "State", "Variables", "NodeNames", "NodeHistory"].forEach((name) => {
    output.push(renderButton.call(this, name));
  })

  return <div class="buttons" key="buttons">{output}</div>;
}

class Viewer extends Component {
  render() {
    if (!this.props.ready) return null;

    return (
      <div>
        {renderLists.call(this)}
        {renderTextWindow.call(this)}
        {renderButtons.call(this)}        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ready: state.Runtime.ready,
    showCharacters: state.View.showCharacters,
    showState: state.View.showState,
    showVariables: state.View.showVariables,
    showNodeNames: state.View.showNodeNames,
    showNodeHistory: state.View.showNodeHistory,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);