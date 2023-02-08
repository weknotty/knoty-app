// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, query, where, getFirestore, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
import { v4 } from "uuid";
import { setIsUserActive, setProfileImageUrl, setUserProfileData } from "./Redux/Utils";
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
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    // return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export const registerUserWithCred = async (password, email, username) => {
  const basicRegister = await createUserWithEmailAndPassword(auth, email, password).catch((err) => {
    console.log(err);
  });
  if (!basicRegister) {
    return false;
  }
  await createProfile({ username, userUID: basicRegister.user.uid });
  return true;
};
export const loginWithEmail = async (email, password) => {
  const basicLogin = await signInWithEmailAndPassword(auth, email, password).catch((err) => {
    console.log(err);
  });
  if (!basicLogin) {
    return false;
  }
  return true;
};
export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const createProfile = async (payload) => {
  const ref = doc(db, "users", v4());
  const req = await setDoc(ref, payload);
  return;
};

export const handleNewEntry = async (uid, dispatch) => {
  const ref = doc(db, "users", uid);
  const res = await getDoc(ref);
  if (!res.exists()) {
    console.log("new user!!");
    const newDocRef = doc(db, "users", uid);
    const code = generateCode();
    const basicSettings = { profileFull: false, secretCode: code, hasActivePartner: false, userActive: true, hasPendingMatch: false };
    await setDoc(newDocRef, basicSettings).catch((err) => console.log(err));
    return;
  }
  console.log("existing user!!!");
  const user = res.data();
  // setUserProfileData(dispatch, user);
  console.log("user", user);
  return;
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
  const mq = query(matchesRef, where("participants", "array-contains", partnerID), where("matchStatus", "in", ["approved", "pending"]));

  const matchesData = await getDocs(mq);

  if (!matchesData.empty) {
    setToast({ state: "warning", text: "Your match is already have connection." });
    return false;
  }

  const user = await getUserProfile(id);
  return { user, partner: { ...res.docs[0].data(), id: res.docs[0].id } };
};

export const createNewMatch = async (id, partnerID, userPayload, partnerPayload) => {
  // console.log("id",id)
  // console.log("partnerID",partnerID)
  // console.log("userPayload",userPayload)
  // console.log("partnerPayload",partnerPayload)

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
  };
  await addDoc(ref, matchPayload);
  setToast({ state: "success", text: "Matched successfuly!" });
  await setMatchSignature(id, partnerID, signature);
  await turnOnPendingMatch(id, partnerID);
  return;
};
export const updateUserStatus = async (id, value) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, { userActive: value }).catch((err) => console.log(err));
  return;
};

export const checkPendingMatches = async (id, matchSignature) => {
  const matchesRef = collection(db, "matches");
  console.log(id);
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
export const cancelMatch = async (id, matchType, status, matchSignature, partnerID) => {
  const matchesRef = collection(db, "matches");
  const mq = query(matchesRef, where("signature", "==", matchSignature), where("matchStatus", "==", matchType));
  const res = await getDocs(mq);
  const data = res.docs[0].data();
  const matchDocRef = doc(db, "matches", res.docs[0].id);
  await updateDoc(matchDocRef, { ...data, matchStatus: status });
  await removeMatchSignature(id, partnerID);
  changeViewState(1);
  setToast({ state: "success", text: "Done." });
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
export const ApproveMatch = async (id) => {
  const matchesRef = collection(db, "matches");
  console.log(id);
  const mq = query(matchesRef, where("participants", "array-contains", id), where("matchStatus", "==", "pending"));
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

export const profileRef = (id) => {
  const ref = doc(db, "users", id);
  return ref;
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
    console.log(el.data());
    const elem = el.data();
    if (elem.initiator == userID) {
      return { ...elem.partner, userID: el.id, partnerID: elem.partnerID };
    }
    return { ...elem.user, userID: el.id, partnerID: elem.userID };
  });

  return mapped;
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
