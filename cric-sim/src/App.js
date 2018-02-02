import React, { Component } from 'react';
import { NavigationDrawer } from 'react-md';
import logo from './logo.svg';
import './styles/app.css';

class App extends Component {
  render() {
    return (
      <NavigationDrawer
        drawerTitle="react-md with CRA"
        toolbarTitle="Welcome to react-md">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </NavigationDrawer>
    );
  }
}

export default App;
