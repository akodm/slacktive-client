export const OPEN_ALERT = "OPEN_ALERT";
export const CLOSE_ALERT = "CLOSE_ALERT";
export const AELRT_CONTENTS_CHANGE = "AELRT_CONTENTS_CHANGE";
export const openAlert = (payload) => ({ type: OPEN_ALERT, payload });
export const closeAlert = () => ({ type: CLOSE_ALERT });
export const alertContentsChange = () => ({ type: AELRT_CONTENTS_CHANGE });