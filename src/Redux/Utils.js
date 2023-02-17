import * as utils from "./Slice";
export const setIsUserActive = (dispatch, value) => {
  dispatch(utils.setUserActive({ isActive: value }));
  return;
};

export const setUserProfileData = (dispatch, value) => {
  dispatch(utils.setUserProfile(value));
  return;
};

export const setUserID = (dispatch, value) => {
  dispatch(utils.setUserID(value));
  return;
};

export const setProfileImageUrl = (dispatch, value) => {
  dispatch(utils.setProfileImageUrl(value));
  return;
};
export const setActivePartner = (dispatch, value) => {
  dispatch(utils.setActivePartner(value));
  return;
};
export const setSecretCode = (dispatch, value) => {
  dispatch(utils.setSecretCode(value));
  return;
};
export const setPartnerImage = (dispatch, value) => {
  dispatch(utils.setPartnerImage(value));
  return;
};
export const setPendingMatchStatus = (dispatch, value) => {
  dispatch(utils.setPendingMatchStatus(value));
  return;
};
export const setProfileFull = (dispatch, value) => {
  dispatch(utils.setProfileFull(value));
  return;
};
export const setHasPendingMatch = (dispatch, value) => {
  dispatch(utils.setHasPendingMatch(value));
  return;
};
export const setPartnerID = (dispatch, value) => {
  dispatch(utils.setPartnerID(value));
  return;
};
export const setMatchSiganture = (dispatch, value) => {
  dispatch(utils.setMatchSiganture(value));
  return;
};
export const setCardsCategory = (dispatch, value) => {
  dispatch(utils.setCardsCategory(value));
  return;
};
export const setCardsList = (dispatch, value) => {
  dispatch(utils.setCardsList(value));
  return;
};
export const setInteractedCards = (dispatch, value) => {
  dispatch(utils.setInteractedCards(value));
  return;
};

export const setGameSignature = (dispatch, value) => {
  dispatch(utils.setGameSignature(value));
  return;
};

export const setHasActiveGame = (dispatch, value) => {
  dispatch(utils.setHasActiveGame(value));
  return;
};

export const setAcceptedManual = (dispatch, value) => {
  dispatch(utils.setAcceptedManual(value));
  return;
};
export const setDoneGame = (dispatch, value) => {
  dispatch(utils.setDoneGame(value));
  return;
};
export const setShowFeedbackPopup = (value) => {
  window.sessionStorage.setItem("showFeedback",value)
};

export const setUsername = (dispatch, value) => {
  dispatch(utils.setUsername(value));
  return;
};

export const setGameID = (dispatch, value) => {
  dispatch(utils.setGameID(value));
  return;
};