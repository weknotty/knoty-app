// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, query, where, getFirestore, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
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
    const basicSettings = { profileFull: false, secretCode: code, hasActivePartner: false, userActive: true };
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

export const findMatchByCode = async (code, id) => {
  const ref = collection(db, "users");
  const q = query(ref, where("secretCode", "==", code));
  const res = await getDocs(q);
  if (res.empty) {
    return false;
  }

  // check if there is pending request;
  
  const user = await getUserProfile(id);

  return { user, partner: { ...res.docs[0].data(), id: res.docs[0].id } };
};

export const createNewMatch = async (id, partnerID, userPayload, partnerPayload) => {
  // console.log("id",id)
  // console.log("partnerID",partnerID)
  // console.log("userPayload",userPayload)
  // console.log("partnerPayload",partnerPayload)
  const ref = collection(db, "matches");
  const matchPayload = {
    userID: id,
    partnerID,
    user: userPayload,
    partner: partnerPayload,
    matchStatus:"pending"
  };
  await addDoc(ref, matchPayload);
};
export const updateUserStatus = async (id, value) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, { userActive: value }).catch((err)=>console.log(err))
  return;
};
