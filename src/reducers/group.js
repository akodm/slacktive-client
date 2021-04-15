import { GROUP_DATA_INIT } from '../actions/group';

const initState = {
  monthUseHolidays: [],
  yearUseHolidays: [],
  monthTardys: [],
  yearTardys: [],
  monthOvers: [],
  yearOvers: [],
  users: [],
  monthAttens: [],
  yearAttens: [],
};

export const groupDataInitReducer = (state = initState, action) => {
  switch(action.type) {
    case GROUP_DATA_INIT:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state;
  }
}