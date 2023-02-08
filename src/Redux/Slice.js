import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userActive: false,
    userProfile: {},
    userID: "",
    profileImageUrl: "",
    hasActivePartner: false,
    secretCode: "",
    partnerImage: "",
    pendingMatchStatus: "",
    profileFull: false,
    hasPendingMatch: false,
    partnerID: "",
    matchSignature: "",
    cardsCategory:"",
    cardsList:[]
    
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
    setProfileFull: (state, action) => {
      state.profileFull = action.payload;
    },
    setHasPendingMatch: (state, action) => {
      state.hasPendingMatch = action.payload;
    },
    setPartnerID: (state, action) => {
      state.partnerID = action.payload;
    },
    setMatchSiganture: (state, action) => {
      state.matchSignature = action.payload;
    },
    setCardsCategory: (state, action) => {
      state.cardsCategory = action.payload;
    },
    setCardsList: (state, action) => {
      state.cardsList = action.payload;
    },
  },
});

// this is for dispatch
export const {
  setUserActive,
  setUserProfile,
  setUserID,
  setProfileImageUrl,
  setActivePartner,
  setSecretCode,
  setPartnerImage,
  setPendingMatchStatus,
  setProfileFull,
  setHasPendingMatch,
  setPartnerID,
  setMatchSiganture,
  setCardsCategory,
  setCardsList
} = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;
