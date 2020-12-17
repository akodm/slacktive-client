import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import moment from 'moment';
import 'moment/locale/ko';
import { Provider } from 'react-redux';
import store from './store';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

moment.locale('ko');

const ResetCss = createGlobalStyle`
  ${reset};
  div::-webkit-scrollbar {
    display: none;
  }
  html::-webkit-scrollbar {
    display: none;
  }
  body::-webkit-scrollbar {
    display: none;
  }
  html, body, div {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  a {
    text-decoration: none;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ResetCss />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
