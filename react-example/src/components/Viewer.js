import { connect } from 'react-redux';
import React, { Component } from 'react';

import ListView from './ListView';

import * as RuntimeActions from '../actions/runtime';
import * as ViewActions from '../actions/view';

function onClick(key, show, event) {
  ViewActions.ChangeVisibility(key, show);
  event.preventDefault();
}

function renderLists() {
  const output = [];
  if (this.props.showCharacters) {
    output.push(
      <ListView 
        list={this.props.characters} 
        name="characters"
        hideFunc={onClick.bind(this, "Characters", false)}
      />
    );
  }
  
  if (this.props.showState) {
    const state = this.props.state;
    const list = Object.keys(state).map((name) => {
      return {name: name, value: state[name]}
    });
    output.push(
      <ListView 
        list={list} 
        name="state"
        lineRenderer={(item) => {
          return <span>
            <label className="variable">{item.name}:</label>
            <span className="value">{item.value}</span>
          </span>
        }}
        hideFunc={onClick.bind(this, "State", false)}
      />
    );
  }
  
  if (this.props.showVariables) {
    output.push(
      <ListView 
        list={this.props.variables} 
        name="variables" 
        hideFunc={onClick.bind(this, "Variables", false)}
      />
    );
  }  

  if (this.props.showNodeNames) {
    output.push(
      <ListView 
        list={this.props.nodeNames} 
        name="nodes" 
        lineRenderer={(item) => {
          return <span>
            <label className="variable">{item}</label>
            <button onClick={RuntimeActions.MoveToNode.bind(null, item)}>Move to {item}</button>
          </span>
        }}
        hideFunc={onClick.bind(this, "NodeNames", false)}
      />
    );
  }

  if (this.props.showNodeHistory) {
    output.push(
      <ListView 
        list={this.props.nodeHistory} 
        name="nodeHistory" 
        hideFunc={onClick.bind(this, "NodeHistory", false)}
      />
    );
  }

  return <div className="lists" key="lists">{output}</div>;
}

function renderTextWindow() {
  const text = [];
  for(let index = 0; index < this.props.text.length; index++) {
    const textLine = this.props.text[index];
    if (textLine.text != null) {
      text.push(<div key={index} className="textLine">{textLine.text}</div>);
    } else if (textLine.command != null) {
      let argNum = -1;
      const commandText = textLine.command.map((arg) => {
        argNum += 1;
        return <span key={argNum} className="argument">{arg}</span>;
      })
      text.push(<div key={index} className="command">{commandText}</div>);
    }
  }

  const options = [];
  let optionIndex = 0;
  if (this.props.options != null) {
    for(let option of this.props.options) {
      const action = RuntimeActions.OptionSelect.bind(null, option)
      options.push(
        <div key={optionIndex}>
          <button onClick={action}>{option.text[0].text}</button>
        </div>
      )
      optionIndex++;
    }
  }

  return (
    <div key="display" className="display">
      {text}
      {options}
    </div>
  );
}

function renderButton(key) {
  const visible = this.props[`show${key}`];
  const text = visible ? "Hide" : "Show";
  const func = onClick.bind(this, key, !visible);
  return <button key={key} onClick={func} className={key.toLowerCase()}>{text} {key}</button>;
}

function runtimeAction(event) {
  this();
  event.preventDefault();
}

function renderPlaybackButtons() {
  const playbackButtons = [];
  if (!this.started) {
    let func = runtimeAction.bind(RuntimeActions.Run);
    playbackButtons.push(
      <button key="startNormal" onClick={func} disabled={this.props.optionWait} >
        Start (Normal)
      </button>
    );
    func = runtimeAction.bind(RuntimeActions.RunStep);    
    playbackButtons.push(
      <button key="startStep" onClick={func} disabled={this.props.optionWait}>
        Start (Single Step)
      </button>
    );
  }

  return playbackButtons;
}

function renderButtons() {
  const output = [];

  output.push(renderPlaybackButtons.call(this));

  ["Characters", "State", "Variables", "NodeNames", "NodeHistory"].forEach((name) => {
    output.push(renderButton.call(this, name));
  })

  return <div className="buttons" key="buttons">{output}</div>;
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
    started: state.Runtime.waitingFor !== "start",
    optionWait: state.Runtime.options !== null,
    options: state.Runtime.options,
    characters: state.Runtime.characters,
    showCharacters: state.View.showCharacters,
    state: state.Runtime.variableState,
    showState: state.View.showState,
    variables: state.Runtime.variables,
    showVariables: state.View.showVariables,
    nodeNames: state.Runtime.nodeNames,
    showNodeNames: state.View.showNodeNames,
    nodeHistory: state.Runtime.nodeHistory,
    showNodeHistory: state.View.showNodeHistory,
    text: state.Runtime.text,
  }
}

export default connect(mapStateToProps)(Viewer);