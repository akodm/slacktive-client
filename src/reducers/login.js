import { SLACK_LOGIN } from '../actions/login';

const initState = {
  user: null,
};

export const slackLoginReducer = (state = initState, action) => {
  switch(action.type) {
    case SLACK_LOGIN:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  }
}