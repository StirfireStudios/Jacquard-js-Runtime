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
  if (selectedOption.segments.length == 0) {
    return <div key={index} className="selectedOption">Unknown</div>;
  }

  let optionText = "Unknown";
  for(let index = 0; index < selectedOption.segments[0].text.length; index++) {
    let text = selectedOption.segments[0].text[index];
    if (text.text != null) {
      optionText = text.text;
      break;
    }
  }
  text.push(<span key={index} className="optionText">{optionText}</span>);

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

function renderDialogSegment(index, segmentData) {
  const parts = [];
  parts.push(<span key="segment">Segment: {segmentData.dialogSegment}</span>)
  if (segmentData.characterIndex > 0) {
    parts.push(<span key="char">Character</span>)
  }
  const subParts = [];
  for(let index = 0; index < segmentData.text.length; index++) {
    var part = renderTextType(segmentData.text[index], index);
    if (part != null) subParts.push(part);
  }
  parts.push(<div key="parts">{subParts}</div>);

  return <div key={index}>{parts}</div>
}

function renderTextType(textType, index) {
  if (textType.command != null) {
    return renderCommand(index, textType.command);
  } else if (textType.nodeEntered != null) {
    return renderNodeEntry(index, textType.nodeEntered);
  } else if (textType.optionSelected != null) {
    return renderSelectedOption(index, textType.optionSelected);
  } else if (textType.variable != null) {
    return renderVariableChange(index, textType.variable);
  } else if (textType.dialogSegment != null) {
    return renderDialogSegment(index, textType);
  } else if (textType.text != null) {
    return renderText(index, textType.text);
  }
  return null;
}

function renderTextArray() {
  const renderedText = [];
  for(let index = 0; index < this.props.text.length; index++) {
    renderedText.push(renderTextType(this.props.text[index]));
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
      let optionText = null;
      for(var segment of option.segments) {
        for (var text of segment.text) {
          if (text.text != null) {
            optionText = text.text;
            break;
          } 
        }
        if (optionText != null) break;
      }
      if (optionText == null) optionText = "unknown";
      options.push(
        <div key={optionIndex}>
          <button onClick={action}>{optionText}</button>
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
