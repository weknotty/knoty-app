import { uploadProfileImage } from "../firebase";
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

export const handleInvitePartner = (phone,secretCode) => {
  if (phone.length < 9) {
    setToast({ state: "warning", text: "Please add valid phone number." });
    return;
  }
  const a = document.createElement("a");
  a.href = `https://wa.me/+972${phone}/?text=Someone has invited you to knoty.your partner code is:${secretCode} Register here: ${window.location.origin}?code=${secretCode}`;
  a.click();
};
