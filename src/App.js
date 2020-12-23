import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import RoutingPage from './pages/Index.js';

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Router>
        <RoutingPage />
      </Router>
    </MuiPickersUtilsProvider>
  );
}

export default App;
