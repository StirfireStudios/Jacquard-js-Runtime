import React, { Component } from 'react';
import { Provider } from 'react-redux';

import CurrentMode from './components/CurrentMode';
import DevTools from './components/DevTools';

import './App.css';

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <CurrentMode/>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
