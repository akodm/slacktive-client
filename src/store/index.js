import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { reducer } from '../reducers';

const middleware = [
  ReduxThunk
];

export default createStore(reducer, applyMiddleware(...middleware));