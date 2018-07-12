import React, { Component } from 'react';

import FuncDialog from './FuncDialog';

function renderText(index, string) {
  return <div key={index} className="text">{string}</div>;
}

function renderCommand(index, args) {
  const renderedArgs = [];
  for(let index = 0; index < args.length; index++) {
    renderedArgs.push(<span key={index} className="argument">{args[index]}</span>);
  }

  return <div key={index} className="command">{renderedArgs}</div>;
}

function renderNodeEntry(index, nodeName) {
  return <div key={index} className="nodeEntry">{nodeName}</div>;
}

function renderSelectedOption(index, selectedOption) {
  const text = [];
  for(let index = 0; index < selectedOption.text.length; index++) {
    const textLine = selectedOption.text[index];
    if (textLine.text == null) continue;
    text.push(<span key={index} className="optionText">{textLine.text}</span>);
  }

  return <div key={index} className="selectedOption">{text}</div>;
}

function renderVariableChange(index, variableData) {
  const type = typeof(variableData.value);
  if (variableData.type === "save") {
    return <div key={index} className="variableSave">{variableData.name} is now {variableData.value} ({type})</div>;
  } else {
    return <div key={index} className="variableLoad">loaded {variableData.value} ({type}) from {variableData.name}</div>;
  }
}

function renderFunction(index, functionData) {
  const { name, args, returnValue, returnRequired } = functionData;
  const parts = [];
  parts.push(<span key="name">Function {name} called</span>);
  parts.push(<span key="args">Args: {args.join(",")}</span>);
  if (returnValue != null) {
    const type = typeof(functionData.returnValue);
    let value = returnValue;
    if (type === 'boolean') value = value ? "true" : "false";
    parts.push(<span key="returnValue">Value: {value} ({type})</span>);
  } 
  if (returnRequired && returnValue != null) {
    parts.push(<span key="returnRequired">Value from user</span>);
  }

  return <div key={index}>{parts}</div>
}

function renderTextArray() {
  const renderedText = [];
  for(let index = 0; index < this.props.text.length; index++) {
    const text = this.props.text[index];
    if (text.text != null) {
      renderedText.push(renderText(index, text.text));
    } else if (text.command != null) {
      renderedText.push(renderCommand(index, text.command));
    } else if (text.nodeEntered != null) {
      renderedText.push(renderNodeEntry(index, text.nodeEntered));
    } else if (text.optionSelected != null) {
      renderedText.push(renderSelectedOption(index, text.optionSelected));
    } else if (text.variable != null) {
      renderedText.push(renderVariableChange(index, text.variable));
    } else if (text.function != null) {
      renderedText.push(renderFunction(index, text.function));
    }
  }
  return renderedText;
}


function renderOptions() {
  const options = [];
  const optionSelect = this.props.optionSelect;
  let optionIndex = 0;


  if (this.props.options != null) {
    for(let option of this.props.options) {
      const action = optionSelect.bind(null, option);
      options.push(
        <div key={optionIndex}>
          <button onClick={action}>{option.text[0].text}</button>
        </div>
      )
      optionIndex++;
    }
  }

  return options;
}

function renderFuncReturn() {
  if (this.props.currentFunc == null) return null;
  return (
    <FuncDialog
      name={this.props.currentFunc.name}
      args={this.props.currentFunc.args}
      submit={this.props.funcCallReturn}
    />
  );
}

export default class TextWindow extends Component {
  render() {
    return (
      <div key={this.props.key} className={this.props.className}>
        {renderTextArray.call(this)}
        {renderOptions.call(this)}
        {renderFuncReturn.call(this)}
      </div>
    )
  }
}
