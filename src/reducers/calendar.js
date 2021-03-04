import { CALENDAR_INIT, CALENDAR_ADD, CALENDAR_UPDATE, CALENDAR_DELETE, USERS_INIT } from '../actions/calendar';

const initState = {
  schedules: [],
  users: [],
};

export const calendarEventReducer = (state = initState, action) => {
  switch(action.type) {
    case CALENDAR_INIT:
      return {
        ...state,
        schedules: action.payload
      }
    case CALENDAR_ADD:
      return {
        ...state,
        schedules: state.schedules.concat(action.payload),
      }
    case CALENDAR_UPDATE:
      return {
        ...state,
        schedules: action.payload,
      }
    case CALENDAR_DELETE:
      return {
        ...state,
        schedules: state.schedules.filter((data) => { 
          if(data.id !== action.payload.id) {
            return true;
          } else {
            if(data.calendarId !== action.payload.calendarId) {
              return true;
            }
          }
          return false;
        })
      }
    default:
      return state;
  }
};

export const usersInitReducer = (state = initState, action) => {
  switch(action.type) {
    case USERS_INIT:
      return {
        ...state,
        users: action.payload
      }
    default:
      return state;
  }
};