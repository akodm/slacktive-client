import React, { useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { slackLogin } from './actions/login';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.slackLoginReducer);
  const slackLoginAction = useCallback((payload) => dispatch(slackLogin(payload)), [dispatch]);

  console.log(user);
  const testRedux = () => {
    slackLoginAction("test user");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={testRedux}>user state update test button</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
