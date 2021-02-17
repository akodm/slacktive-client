import { CLOSE_ALERT, OPEN_ALERT, AELRT_CONTENTS_CHANGE } from '../actions/alert';

const initState = {
  alert: false,
  contents: "",
};

export const alertOpenCloseReducer = (state = initState, action) => {
  switch(action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        alert: true,
        contents: action.payload
      }
    case CLOSE_ALERT:
      return {
        ...state,
        alert: false,
        contents: ""
      }
    case AELRT_CONTENTS_CHANGE:
      return {
        ...state,
        alert: action.payload.alert,
        contents: action.payload.contents
      }
    default:
      return state;
  }
}