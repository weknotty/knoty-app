// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, query, where, getFirestore, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";
import { v4 } from "uuid";
import { setDoneGame, setIsUserActive, setProfileImageUrl, setShowFeedbackPopup, setUserProfileData } from "./Redux/Utils";
import { changeViewState, generateCode, setToast } from "./Utils";
const firebaseConfig = {
  apiKey: "AIzaSyBQnnl1a0XyOI60fxD0ZxLh4ITt8OkrcO4",
  authDomain: "knoty-8cb40.firebaseapp.com",
  projectId: "knoty-8cb40",
  storageBucket: "knoty-8cb40.appspot.com",
  messagingSenderId: "650572781542",
  appId: "1:650572781542:web:558f4aa7c74afabc712827",
  measurementId: "G-Y51TQDE2XH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
setPersistence(auth, browserSessionPersistence)
  .then(() => {})
  .catch((error) => {});

const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
export const registerUserWithCred = async (password, email, dispatch) => {
  const basicRegister = await createUserWithEmailAndPassword(auth, email, password).catch((err) => {
    console.log(err);
  });
  if (!basicRegister) {
    return false;
  }
  await handleNewEntry(basicRegister.user.uid, dispatch);
  return true;
};
export const loginWithEmail = async (email, password, dispatch) => {
  const basicLogin = await signInWithEmailAndPassword(auth, email, password).catch((err) => {
    console.log(err);
  });
  if (!basicLogin) {
    return false;
  }
  await updateUserStatus(basicLogin.user.uid, true, true, dispatch);

  return true;
};
export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  return await signInWithPopup(auth, provider);
};
export const createProfile = async (payload) => {
  const ref = doc(db, "users", v4());
  await setDoc(ref, payload);
  return;
};

export const handleNewEntry = async (uid, dispatch) => {
  try {
    const ref = doc(db, "users", uid);
    const res = await getDoc(ref);
    if (!res.exists()) {
      const newDocRef = doc(db, "users", uid);
      const code = generateCode();
      const basicSettings = {
        profileFull: false,
        secretCode: code,
        hasActivePartner: false,
        userActive: true,
        hasPendingMatch: false,
        cards: [],
        hasActiveGame: false,
        gameSignature: "",
        points: "0",
      };
      const statusRef = collection(db, "statuses");

      const all = [
        setDoc(newDocRef, basicSettings).catch((err) => console.log(err)),
        addDoc(statusRef, { userActive: true, userID: uid, loginCount: 1 }).catch((err) => console.log(err)),
      ];
      await Promise.all(all);
      return;
    }

    await updateUserStatus(uid, true, true, dispatch);
    return;
  } catch (err) {
    console.log("err", err);
  }
};

export const uploadProfileImage = async (file, id, dispatch) => {
  const storageRef = ref(storage, "profileImages" + "/" + id + "/" + file.name);
  const req = await uploadBytes(storageRef, file);
  let url = `https://firebasestorage.googleapis.com/v0/b/knoty-8cb40.appspot.com/o/${encodeURIComponent(req.ref.fullPath)}?alt=media`;
  await updateProfileProp(id, "profileImageUrl", url).catch((err) => console.log(err));
  setProfileImageUrl(dispatch, url);
};
export const updateProfileProp = async (id, prop, value) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, { [prop]: value });
};
export const updateProfileCards = async (id, value) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, { cards: value });
};
export const updateProfileData = async (id, payload) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, { profile: payload, profileFull: true }).catch((err) => console.log(err));
  setToast({ state: "success", text: "Profile saved succesfuly!" });
  return;
};

export const getUserProfile = async (id) => {
  const ref = doc(db, "users", id);
  const res = await getDoc(ref);
  if (!res.exists()) {
    return false;
  }
  return res.data();
};
export const getUserProfileByCode = async (code) => {
  const ref = collection(db, "users");
  const q = query(ref, where("secretCode", "==", code));

  const res = await getDocs(q);
  if (res.empty) {
    return false;
  }
  return res.docs[0].data();
};
export const findMatchByCode = async (code, id, signature, partnerID) => {
  const ref = collection(db, "users");
  const q = query(ref, where("secretCode", "==", code), where("profileFull", "==", true));
  const res = await getDocs(q);

  if (res.empty) {
    setToast({ state: "warning", text: "No match found with this number." });
    return false;
  }
  if (res.docs[0].id == id) {
    setToast({ state: "warning", text: "Nice,But you cannot make a match with yourself." });
    return false;
  }

  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("participants", "array-contains", res.docs[0].id), where("matchStatus", "in", ["approved"]));

  const matchesData = await getDocs(mq);

  if (!matchesData.empty) {
    setToast({ state: "warning", text: "Your match is already have connection." });
    return false;
  }

  const user = await getUserProfile(id);
  return { user, partner: { ...res.docs[0].data(), id: res.docs[0].id } };
};

export const createNewMatch = async (id, partnerID, userPayload, partnerPayload) => {
  const ref = collection(db, "matches");
  const signature = v4();
  const matchPayload = {
    userID: id,
    partnerID,
    user: userPayload,
    partner: partnerPayload,
    participants: [id, partnerID],
    initiator: id,
    userStatus: "approved",
    partnerStatus: "pending",
    matchStatus: "pending",
    signature: signature,
    acceptedManual: false,
  };
  const all = [addDoc(ref, matchPayload), setMatchSignature(id, partnerID, signature), turnOnPendingMatch(id, partnerID)];
  await Promise.all(all);
  setToast({ state: "success", text: "Matched successfuly!" });

  return;
};
export const updateUserStatus = async (id, value, withCount, dispatch) => {
  const ref = collection(db, "statuses");
  const q = query(ref, where("userID", "==", id));
  const res = await getDocs(q);
  if (res.empty) {
    return false;
  }
  const docRef = doc(db, "statuses", res.docs[0].id);
  const data = res.docs[0].data();
  const newLoginCount = parseInt(data.loginCount) + 1;
  if (withCount) {
    if (newLoginCount === 7) {
      setShowFeedbackPopup(true);
    }
  }

  const payload = withCount ? { userActive: value, loginCount: newLoginCount } : { userActive: value };
  await updateDoc(docRef, payload).catch((err) => console.log(err));
  return;
};

export const getMatchBySignature = async (id, matchSignature) => {
  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("signature", "==", matchSignature));

  const matchesData = await getDocs(mq);
  if (matchesData.empty) {
    return false;
  }
  const data = matchesData.docs[0].data();
  if (data.initiator == id) {
    return { ...data.partner, matchStatus: "approved", id: data.partnerID };
  }
  return { ...data.user, matchStatus: "pending", id: data.userID };
};
export const checkPendingMatches = async (id, matchSignature) => {
  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("signature", "==", matchSignature), where("partnerStatus", "==", "pending"));
  const matchesData = await getDocs(mq);
  if (matchesData.empty) {
    return false;
  }
  const data = matchesData.docs[0].data();
  if (data.initiator == id) {
    return { ...data.partner, matchStatus: "approved" };
  }
  return { ...data.user, matchStatus: "pending" };
};
export const cancelMatch = async (id, matchType, status, matchSignature, partnerID, hasActiveGame) => {
  if (hasActiveGame) {
    setToast({ state: "warning", text: "Before unmatching please end your current game." });
    return;
  }
  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("signature", "==", matchSignature), where("matchStatus", "==", matchType));
  const res = await getDocs(mq);
  const data = res.docs[0].data();
  const matchDocRef = doc(db, "matches", res.docs[0].id);
  await updateDoc(matchDocRef, { ...data, matchStatus: status });
  await removeMatchSignature(id, partnerID);
  setToast({ state: "success", text: "Done." });
  changeViewState(1);
  return;
};

export const turnOffPendingMatch = async (id, partnerID) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[(updateDoc(userRef, { hasPendingMatch: false }), updateDoc(partnerRef, { hasPendingMatch: false }))];
  changeViewState(0);
};
export const turnOnPendingMatch = async (id, partnerID) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[(updateDoc(userRef, { hasPendingMatch: true }), updateDoc(partnerRef, { hasPendingMatch: true }))];
};
export const setMatchSignature = async (id, partnerID, signature) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[(updateDoc(userRef, { matchSignature: signature }), updateDoc(partnerRef, { matchSignature: signature }))];
};
export const removeMatchSignature = async (id, partnerID) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[(updateDoc(userRef, { matchSignature: "" }), updateDoc(partnerRef, { matchSignature: "" }))];
};
export const turnOnActivePartner = async (id, partnerID) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[
    (updateDoc(userRef, { hasActivePartner: true, hasPendingMatch: false }), updateDoc(partnerRef, { hasActivePartner: true, hasPendingMatch: false }))
  ];
};
export const turnOffActivePartner = async (id, partnerID) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[(updateDoc(userRef, { hasActivePartner: false }), updateDoc(partnerRef, { hasActivePartner: false }))];
};
export const ApproveMatch = async (matchSignature) => {
  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("signature", "==", matchSignature));
  const res = await getDocs(mq);
  const data = res.docs[0].data();
  const matchDocRef = doc(db, "matches", res.docs[0].id);
  await updateDoc(matchDocRef, { ...data, matchStatus: "approved", partnerStatus: "approved" });
  setToast({ state: "success", text: "Approved!" });
  changeViewState(4);
};

export const FindMatch = (matchSignature) => {
  const ref = collection(db, "matches");
  const q = query(ref, where("signature", "==", matchSignature));
  return q;
};
export const FindMatchPartner = async (matchSignature) => {
  console.log(matchSignature);
  const ref = collection(db, "users");
  const q = query(ref, where("matchSignature", "==", matchSignature));
  const res = await getDocs(q);

  const item = res.docs.filter((el) => {
    if (el.id != auth.currentUser.uid) {
      return el;
    }
  });
  if (item == false) {
    return false;
  }
  const docRef = doc(db, "users", item[0].id);
  return docRef;
};

export const profileRef = (id) => {
  const ref = doc(db, "users", id);
  return ref;
};
export const getCurrentGame = async (gameSignature) => {
  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("signature", "==", gameSignature), where("status", "==", "start"));
  const res = await getDocs(q);
  if (res.empty) {
    return false;
  }
  return doc(db, "games", res.docs[0].id);
};
export const getMatchesList = async (userID) => {
  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("participants", "array-contains", userID), where("matchStatus", "==", "approved"));
  const mq2 = query(matchesRef, where("participants", "array-contains", userID), where("matchStatus", "==", "done"));

  const res = await getDocs(mq);
  const res2 = await getDocs(mq2);

  if (res.empty && res2.empty) {
    return false;
  }
  const total = [...res.docs, ...res2.docs];
  const mapped = total.map((el) => {
    const elem = el.data();
    if (elem.initiator == userID) {
      return { ...elem.partner, userID: el.id, partnerID: elem.partnerID };
    }
    return { ...elem.user, userID: el.id, partnerID: elem.userID };
  });
  const maybe = mapped.filter((v, i, a) => a.findIndex((v2) => v2.partnerID === v.partnerID) === i);
  return maybe;
};

export const getCategories = async () => {
  const ref = collection(db, "categories");
  const res = await getDocs(ref);
  const mapped = res.docs.map((el) => {
    return el.data();
  });
  return mapped;
};
export const getCategoriesByType = async (category) => {
  const ref = collection(db, "cards");
  const q = query(ref, where("category", "==", category));
  const res = await getDocs(q);
  if (res.empty) {
    return false;
  }
  const mapped = res.docs.map((el) => {
    return el.data();
  });
  return mapped;
};

export const setCards = async (list) => {
  const ref = collection(db, "categories");
  list.forEach(async (el) => {
    await addDoc(ref, el);
  });
};

export const setCardRating = async (id, data, rating, cardID) => {
  const ref = doc(db, "users", id);
  const filtered = data.filter((el) => {
    return el.card != cardID;
  });

  const payload = {
    card: cardID,
    rating,
    isLiked: false,
  };
  const total = [...filtered, payload];
  await setDoc(ref, { cards: total }, { merge: true });
};

export const setCardLiked = async (id, data, cardSource, cardsCategory, isLike) => {
  const cardID = cardSource.id;

  const ref = doc(db, "users", id);
  const filtered = data.filter((el) => {
    return el.card != cardID;
  });
  const item = data.filter((el) => {
    return el.card == cardID;
  });
  let payload = {};
  if (item == false) {
    payload = {
      card: cardID,
      rating: 0,
      category: cardsCategory,
      isLiked: isLike,
    };
  }
  if (item != false) {
    payload = {
      ...item[0],
      isLiked: isLike,
    };
  }

  const total = [...filtered, payload];
  await updateDoc(ref, { cards: total }).catch((err) => console.log(err));
  return;
};

export const getGameData = async (signature) => {
  const ref = collection(db, "games");
  const q = query(ref, where("signature", "==", signature), where("status", "==", "start"));
  const data = await getDocs(q);
  if (data.empty) {
    return false;
  }
  return data.docs[0].data();
};
export const handleCanceledGame = async (cardID, userCards, partnerCards, userID, partnerID) => {
  const mappedCardsA = userCards.map((els) => {
    if (els.card == cardID) {
      // console.log(els);
      return { ...els, isLiked: false };
    }
    return els;
  });
  const mappedCardsB = partnerCards.map((els) => {
    if (els.card == cardID) {
      return { ...els, isLiked: false };
    }
    return els;
  });
  const all = [updateProfileCards(userID, mappedCardsA), updateProfileCards(partnerID, mappedCardsB), removeGameTrailes(userID, partnerID)];
  await Promise.all(all);
};
export const cancelGame = async (gameID) => {
  const gameRef = doc(db, "games", gameID);
  await updateDoc(gameRef, { status: "canceled" });
};

export const removeGameTrailes = async (id, partnerID) => {
  const userRef = doc(db, "users", id);
  const partnerRef = doc(db, "users", partnerID);
  await Promise.all[(updateDoc(userRef, { gameSignature: "", hasActiveGame: false }), updateDoc(partnerRef, { gameSignature: "", hasActiveGame: false }))];
};

export const updateGameStatus = async (signature, status) => {
  const ref = collection(db, "games");
  const q = query(ref, where("signature", "==", signature));
  const data = await getDocs(q);
  if (data.empty) {
    return false;
  }
  const gameRef = doc(db, "games", data.docs[0].id);
  await updateDoc(gameRef, { status: status });
};
export const handleFinishGame = async (userCards, partnerCards, cardID, userID, partnerID, gamePoints, userPoints, partnerPoints) => {
  const mappedCardsA = userCards.map((els) => {
    if (els.card == cardID) {
      return { ...els, isLiked: false };
    }
    return els;
  });
  const mappedCardsB = partnerCards.map((els) => {
    if (els.card == cardID) {
      return { ...els, isLiked: false };
    }
    return els;
  });
  const userAPayload = parseInt(gamePoints) + parseInt(userPoints);
  const userBPayload = parseInt(gamePoints) + parseInt(partnerPoints);
  const all = [
    removeGameTrailes(userID, partnerID),
    updateProfileCards(userID, mappedCardsA),
    updateProfileCards(partnerID, mappedCardsB),
    updateProfileProp(userID, "points", userAPayload),
    updateProfileProp(partnerID, "points", userBPayload),
  ];

  await Promise.all(all);
};
export const finishGame = async (gameID) => {
  const gameRef = doc(db, "games", gameID);
  await updateDoc(gameRef, { status: "done" });
};

export const getFavouritesCards = async (dataSource) => {
  const ref = collection(db, "cards");
  const data = await getDocs(ref);
  if (data.empty) {
    return false;
  }
  const temp = [];
  for (let source of data.docs) {
    const localData = source.data();
    for (let item of dataSource) {
      if (localData.id == item.card && item.isLiked) {
        temp.push({ ...localData });
      }
    }
  }
  return temp;
};

export const addGamePoints = async (gameSignature, currentPoints, gamePoints) => {
  const ref = collection(db, "users");
  const q = query(ref, where("gameSignature", "==", gameSignature));
  const data = await getDocs(q);

  if (data.empty) {
    return false;
  }
  const userA = data.docs[0];
  const userB = data.docs[1];
  const userAPayload = parseInt(currentPoints) + parseInt(gamePoints);
  const userBPayload = parseInt(currentPoints) + parseInt(gamePoints);
  await updateProfileProp(userA.id, "points", userAPayload);
  await updateProfileProp(userB.id, "points", userBPayload);
};

export const getUsersStatus = async (partnerID) => {
  const refs = collection(db, "statuses");
  const q = query(refs, where("userID", "==", partnerID));
  const res = await getDocs(q);
  if (res.empty) {
    return false;
  }
  return res.docs[0].data();
};

export const approveManual = async (id) => {
  const ref = doc(db, "users", id);
  const data = await getDoc(ref);

  if (!data.exists()) {
    return false;
  }
  await updateDoc(ref, { acceptedManual: true });
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email).catch(() => {
    setToast({ state: "danger", text: "Email not found." });
    return;
  });
  setToast({ state: "success", text: "Email send succesfuly." });
  return;
};

export const setNewFeeback = async (value, userID) => {
  const ref = collection(db, "feedbacks");
  const payload = {
    feebacks: value,
    userID,
  };
  await addDoc(ref, payload);
  window.sessionStorage.removeItem("showFeedback");
  changeViewState(0);
  return;
};

export const setPageView = async (data) => {
  logEvent(analytics, "page_view", data);
};

export const setSwipesEvent = ({ cardID, userID }) => {
  logEvent(analytics, "swipedCard", { userID, cardID });
};
export const setNewCategoryClick = ({ category, categoryID, userID }) => {
  logEvent(analytics, "categoryClick", { category, categoryID, userID });
};

export const deleteAccountFromDB = async () => {
  const ref = doc(db, "users", auth.currentUser.uid);
  await deleteDoc(ref);
  sessionStorage.clear();
  window.location.href = "/";
};
const createNewGame = ({ gameSignature, duration, imageUrl, cardID, cardName, points }) => {
  const now = new Date().getTime() / 1000;
  const payload = {
    duration: duration,
    status: "start",
    signature: gameSignature,
    imageUrl: imageUrl,
    cardID: cardID,
    cardName: cardName,
    points: points,
    startedIn: now,
  };
  return payload;
};
const returnSignale = async (signature, userID, myCards, partnerCards) => {
  const userRef = doc(db, "users", userID);
  const gamesRef = collection(db, "games");
  const gameQuery = query(gamesRef, where("signature", "==", signature), where("status", "==", "start"));
  const res = await getDocs(gameQuery);
  if (!res.empty) {
    console.log("have game already great!!!!");
    return false;
  }

  for (let cardA of myCards) {
    for (let cardB of partnerCards) {
      if (cardA.isLiked && cardB.isLiked) {
        const cardID = cardA.card;
        const cardsRef = query(collection(db, "cards"), where("id", "==", cardID));
        const gameSignature = signature;
        const card = await getDocs(cardsRef);
        const cardData = card.docs[0].data();
        const gamePayload = createNewGame({
          gameSignature: gameSignature,
          cardID: cardData.id,
          duration: cardData.duration,
          imageUrl: cardData.imageUrl,
          cardName: cardData.name,
          points: cardData.points,
        });
        console.log(gamePayload);
        return gamePayload;
      }
    }
  }
};
export const checkCardsMatch = async (myCard, partnerCards, signature, userID, partnerID) => {
  const userRef = doc(db, "users", userID);
  const gamesRef = collection(db, "games");
  const usersPayload = { hasActiveGame: true, gameSignature: signature };
  const partnerRef = doc(db, "users", partnerID);

  // console.log(gamePayload);
  returnSignale(signature, userID, myCard, partnerCards).then(async (res) => {
    if (res) {
      const all = [updateDoc(userRef, usersPayload), updateDoc(partnerRef, usersPayload), addDoc(gamesRef, res)];
      await Promise.all(all);
    }
  });

  return;
};
