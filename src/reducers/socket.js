import {
  SOCKET_INIT
} from "../actions/socket";

const socketState = {
  socket: null
};

export const socketInitReducer = (state = socketState, action) => {
  switch(action.type) {
    case SOCKET_INIT: 
      return {
        ...state,
        socket: action.payload
      };
    default: 
      return state;
  }
};