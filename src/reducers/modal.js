import { OPEN_MODAL, CLOSE_MODAL, MODAL_CONTENTS_CHANGE } from '../actions/modal';

const initState = {
  modal: false,
  contents: null,
  width: 0,
  height: 0,
  close: true,
  backdrop: false,
};

export const modalOpenCloseReducer = (state = initState, action) => {
  switch(action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        modal: true,
        contents: action.payload.contents,
        width: action.payload.width,
        height: action.payload.height,
        close: action.payload.close,
        backdrop: action.payload.backdrop,
      }
    case CLOSE_MODAL:
      return {
        ...state,
        modal: false,
        contents: null,
        width: 0,
        height: 0,
        close: true,
        backdrop: false,
      }
    case MODAL_CONTENTS_CHANGE:
      return {
        ...state,
        modal: action.payload.modal,
        contents: action.payload.contents,
        width: action.payload.width,
        height: action.payload.height,
        close: action.payload.close,
        backdrop: action.payload.backdrop,
      }
    default:
      return state;
  }
}