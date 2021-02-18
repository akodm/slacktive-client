export const CALENDAR_INIT = "CALENDAR_INIT";
export const CALENDAR_ADD = "CALENDAR_ADD";
export const CALENDAR_UPDATE = "CALENDAR_UPDATE";
export const CALENDAR_DELETE = "CALENDAR_DELTE";
export const calendarInit = (payload) => ({ type: CALENDAR_INIT, payload });
export const calendarAdd = (payload) => ({ type: CALENDAR_ADD, payload });
export const calendarUpdate = (payload) => ({ type: CALENDAR_UPDATE, payload });
export const calendarDelete = (payload) => ({ type: CALENDAR_DELETE, payload });