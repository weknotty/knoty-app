import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userActive: false,
    userProfile: {},
    userID: "",
    profileImageUrl: "",
    hasActivePartner: false,
    secretCode:"",
    partnerImage:"",
    pendingMatchStatus:""
  },
  reducers: {
    setUserActive: (state, action) => {
      state.userActive = action.payload.isActive;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setProfileImageUrl: (state, action) => {
      state.profileImageUrl = action.payload;
    },
    setActivePartner: (state, action) => {
      state.hasActivePartner = action.payload;
    },
    setSecretCode: (state, action) => {
      state.secretCode = action.payload;
    },
    setPartnerImage: (state, action) => {
      state.partnerImage = action.payload;
    },
    setPendingMatchStatus: (state, action) => {
      state.pendingMatchStatus = action.payload;
    },
  },
});

// this is for dispatch
export const { setUserActive, setUserProfile, setUserID, setProfileImageUrl, setActivePartner,setSecretCode,setPartnerImage,setPendingMatchStatus } = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;
