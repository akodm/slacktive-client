import { combineReducers } from 'redux';
import { slackLoginReducer } from './login';
import { alertOpenCloseReducer } from './alert';
import { modalOpenCloseReducer } from './modal'

export const reducer = combineReducers({
  slackLoginReducer,
  alertOpenCloseReducer,
  modalOpenCloseReducer,
});