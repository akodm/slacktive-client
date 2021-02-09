import { CLOSE_ALERT, OPEN_ALERT, AELRT_CONTENTS_CHANGE } from '../actions/alert';

const initState = {
  modal: false,
  contents: "",
};

export const modalOpenCloseReducer = (state = initState, action) => {
  switch(action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        modal: true,
        contents: action.payload
      }
    case CLOSE_ALERT:
      return {
        ...state,
        modal: false,
        contents: ""
      }
    case AELRT_CONTENTS_CHANGE:
      return {
        ...state,
        modal: action.payload.modal,
        contents: action.payload.contents
      }
    default:
      return state;
  }
}