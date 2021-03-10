import { MYPAGE_DATA_INIT } from '../actions/mypage';

const initState = {
  holidays: [],
  attens: [],
  avgAttens: [],
  tardys: [],
  overs: [],
};

export const mypageDataInitReducer = (state = initState, action) => {
  switch(action.type) {
    case MYPAGE_DATA_INIT:
      return {
        ...state,
        holidays: action.payload.holidays || [],
        attens: action.payload.attens || [],
        avgAttens: action.payload.avgAttens || [],
        tardys: action.payload.tardys || [],
        overs: action.payload.overs || [],
      }
    default:
      return state;
  }
}