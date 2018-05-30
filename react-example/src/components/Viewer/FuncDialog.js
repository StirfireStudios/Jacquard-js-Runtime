import React, { Component } from 'react';

function onValueChange(event) {
  this.setState({value: event.target.value});
}

function onSubmitValue(event) {
  this.props.submit(this.state.value);
  event.preventDefault();
}

export default class FuncDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    }
  }

  render() {

    return (
      <div>
        <div key="name">Enter return value for function call "{this.props.name}"</div>
        <div key="args">With args: {this.props.args.join(",")}</div>
        <input type="text" value={this.state.value} onChange={onValueChange.bind(this)}/>
        <button onClick={onSubmitValue.bind(this)}>Send</button>
      </div>
    )
  }
}
