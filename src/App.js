import React, { Component } from 'react';
import logo from './logo.svg';
import puppeteer from 'puppeteer';

import './App.css';

const upload = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://ballchasing.com');
  await page.setViewport({width: 1024, height: 768});
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={upload}>start</button>
      </div>
    );
  }
}

export default App;
