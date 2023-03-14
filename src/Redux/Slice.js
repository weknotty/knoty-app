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
    cardsCategory: "",
    cardsList: [],
    interactedCards: [],
    hasActiveGame: false,
    gameSignature: "",
    acceptedManual:false,
    doneGame:false,
    showFeedbackPopup:false,
    username:"",
    showInviteButton:false,
    gameID:"",
    points:""

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
    setInteractedCards: (state, action) => {
      state.interactedCards = action.payload;
    },
    setHasActiveGame: (state, action) => {
      state.hasActiveGame = action.payload;
    },
    setGameSignature: (state, action) => {
      state.gameSignature = action.payload;
    },
    setAcceptedManual: (state, action) => {
      state.acceptedManual = action.payload;
    },
    setDoneGame: (state, action) => {
      state.doneGame = action.payload;
    },
    setShowFeedbackPopup: (state, action) => {
      state.showFeedbackPopup = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setGameID: (state, action) => {
      state.gameID = action.payload;
    },
    setPoints: (state, action) => {
      state.points = action.payload;
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
  setCardsList,
  setInteractedCards,
  setHasActiveGame,
  setGameSignature,
  setAcceptedManual,
  setDoneGame,
  setShowFeedbackPopup,
  setUsername,
  setGameID,
  setPoints
} = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;
