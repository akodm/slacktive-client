import { combineReducers } from 'redux';

import { slackLoginReducer } from './login';

 import { modalOpenCloseReducer } from './alert';

export const reducer = combineReducers({
  slackLoginReducer,
  modalOpenCloseReducer
});