import { combineReducers } from 'redux';
import { slackLoginReducer } from './login';
import { alertOpenCloseReducer } from './alert';
import { modalOpenCloseReducer } from './modal';
import { calendarEventReducer, usersInitReducer } from './calendar';
import { loadmaskOnOffReducer } from './loadmask';
import { mypageDataInitReducer } from './mypage';

export const reducer = combineReducers({
  slackLoginReducer,
  alertOpenCloseReducer,
  modalOpenCloseReducer,
  calendarEventReducer,
  usersInitReducer,
  loadmaskOnOffReducer,
  mypageDataInitReducer,
});