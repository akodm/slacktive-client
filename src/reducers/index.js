import { combineReducers } from 'redux';

import { 
  slackLoginReducer,
  modalOpenCloseReducer,
 } from './login';

export const reducer = combineReducers({
  slackLoginReducer,
  modalOpenCloseReducer
});