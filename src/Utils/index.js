import { setPageView, uploadProfileImage } from "../firebase";
import { setProfileImageUrl } from "../Redux/Utils";

export const changeViewState = (value) => {
  const ev = new CustomEvent("changeState", { detail: value });
  document.dispatchEvent(ev);
  return;
};

export const validateEmail = (value) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailOk = value.toLowerCase().match(emailRegex);
  if (!emailOk) {
    return false;
  }
  return true;
};

export const validateUsername = (value) => {
  if (value.length < 3) {
    return false;
  }
  return true;
};

export const validatePassword = (value) => {
  if (value.length < 6) {
    return false;
  }
  return true;
};
export const validatePasswords = (pass1, pass2) => {
  if (pass1 != pass2) {
    return false;
  }
  return true;
};
export const handleFieldValidation = (value, validator, toastMessage, setValue) => {
  if (!value) {
    return;
  }
  const res = validator(value);
  if (!res) {
    setToast({ state: "failed", text: toastMessage });
    return;
  }
  setValue(value);
  return;
};
export const setToast = ({ state, text }) => {
  const ev = new CustomEvent("setToast", { detail: { state, text } });
  document.dispatchEvent(ev);
  return;
};

export const handlePasswordsValidation = (pass1, pass2, setValue) => {
  if (!pass2) {
    return;
  }
  const passwordsMatch = validatePasswords(pass1, pass2);
  if (!passwordsMatch) {
    setToast({ state: "failed", text: "Passwords should match." });
    return;
  }
  setValue(pass2);
};

export const handleUploadChange = async (e, id, dispatch, setIsUploading) => {
  const file = e.target.files[0];
  console.log(file);
  setIsUploading(true);
  if (file) {
    // if(file.size > 12582912){
    if (file.size > 1048576) {
      // setUploadOk(false);
      setToast({ state: "warning", text: "File size should be maximum 1 MB" });
      e.target.value = null;
      setIsUploading(false);

      return;
    }
    const splittedType = file.type.split("/");
    const type = splittedType[0];
    if (type !== "image") {
      setToast({ state: "warning", text: "Upload only Image type of file." });
      e.target.value = null;
      setIsUploading(false);

      return;
    }
    await uploadProfileImage(file, id, dispatch).catch((err) => console.log(err));
    setToast({ state: "success", text: "Image saved succesfuly!" });
    setIsUploading(false);
  }
};

export const generateCode = () => {
  const code = parseInt(Math.random() * 1000000000, 10);
  return `${code}`;
};

export const handleInvitePartner = (phone, secretCode) => {
  if (phone.length < 9) {
    setToast({ state: "warning", text: "Please add valid phone number." });
    return;
  }
  const a = document.createElement("a");
  a.href = `https://wa.me/+972${phone}/?text=Someone has invited you to knoty.your partner code is:${secretCode} Register here: ${window.location.origin}?code=${secretCode}`;
  a.click();
};

export const handleAgeInput = (value, setAge) => {
  let newVal = value.replace(/[^0-9.]/g, "");
  if (newVal > 90) {
    setToast({ state: "warning", text: "Maxmimum age is 90." });
    return;
  }
  if (newVal <= 10) {
    newVal = value.replace(value, "");
    return;
  }
  setAge(newVal);
  return newVal;
};

export const pathObject = {
  myProfile: {
    page_path: "/myProfile",
    page_title: "myProfile",
    page_location: "",
  },
  choosePartner: { page_location: "", page_path: "/partners", page_title: "partners" },
  contactingPartner: { page_location: "", page_path: "/contactPartner", page_title: "contactPartner" },
  feedback: { page_location: "", page_path: "/feedback", page_title: "feedback" },
  cardCategories: { page_location: "", page_path: "/cardCategories", page_title: "cardCategories" },
  partnerProfile: { page_location: "", page_path: "/partnerProfile", page_title: "partnerProfile" },
  userManual: { page_location: "", page_path: "/userManual", page_title: "userManual" },
  specificCard: { page_location: "", page_path: "/card", page_title: "card" },
  gameTimer: { page_location: "", page_path: "/getKnoty", page_title: "getKnoty" },
  favorites: { page_location: "", page_path: "/favorites", page_title: "favorites" },
};

export const handleAnalyticsPath = (target) => {
  if (target === 0) {
    setPageView(pathObject.myProfile);
  }
  if (target === 1) {
    setPageView(pathObject.choosePartner);
  }
  if (target === 2) {
    setPageView(pathObject.contactingPartner);
  }
  if (target === 3) {
    setPageView(pathObject.feedback);
  }
  if (target === 4) {
    setPageView(pathObject.cardCategories);
  }
  if (target === 5) {
    setPageView(pathObject.partnerProfile);
  }
  if (target === 6) {
    setPageView(pathObject.userManual);
  }
  if (target === 7) {
    setPageView(pathObject.specificCard);
  }
  if (target === 8) {
    setPageView(pathObject.gameTimer);
  }
  if (target === 9) {
    setPageView(pathObject.favorites);
  }
};
