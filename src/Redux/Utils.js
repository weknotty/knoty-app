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