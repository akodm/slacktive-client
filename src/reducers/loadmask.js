import { LOADMASK_ON, LOADMASK_OFF } from '../actions/loadmask';

const initState = {
  loadmask: false,
};

export const loadmaskOnOffReducer = (state = initState, action) => {
  switch(action.type) {
    case LOADMASK_ON:
      return {
        ...state,
        loadmask: true
      }
    case LOADMASK_OFF:
      return {
        ...state,
        loadmask: false
      }
    default:
      return state;
  }
}