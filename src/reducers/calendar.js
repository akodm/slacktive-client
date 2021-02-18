import { CALENDAR_INIT, CALENDAR_ADD, CALENDAR_UPDATE, CALENDAR_DELETE } from '../actions/calendar';

const initState = {
  schedules: [],
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
        schedules: state.schedules.filter((data) => { return data.id !== action.payload.id }),
      }
    default:
      return state;
  }
}