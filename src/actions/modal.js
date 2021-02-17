export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const MODAL_CONTENTS_CHANGE = "MODAL_CONTENTS_CHANGE";
export const openModal = (payload) => ({ type: OPEN_MODAL, payload });
export const closeModal = () => ({ type: CLOSE_MODAL });
export const modalContentsChange = () => ({ type: MODAL_CONTENTS_CHANGE });