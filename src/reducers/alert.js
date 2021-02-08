import { CLOSE_ALERT, OPEN_ALERT } from '../actions/alert';

const initState = {
  modal: false,
};

export const modalOpenCloseReducer = (state = initState, action) => {
  switch(action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        modal: true
      }
    case CLOSE_ALERT:
      return {
        ...state,
        modal: false
      }
    default:
      return state;
  }
}