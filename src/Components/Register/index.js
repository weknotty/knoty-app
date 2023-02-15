import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { redirect } from "react-router-dom";
import { v4 } from "uuid";
import { registerUserWithCred } from "../../firebase";
import { handleFieldValidation, handlePasswordsValidation, setToast, validateEmail, validatePassword, validatePasswords, validateUsername } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import GoogleButton from "../GoogleButton";
import Password from "../Password";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [matchingPassword, setMatchingPassword] = useState("");
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch()

  const handlePasswordDisplay = (e) => {
    try {
      const elems = document.querySelectorAll(".pss");
      const centerAbs = document.querySelectorAll(".centerAbs");
      elems.forEach((el) => {
        el.type = "password";
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (submit) {
      if (!userName || userName.length < 3) {
        setToast({ state: "failed", text: "Username should have minimum 3 characters." });
        setSubmit(false);
        return;
      }
      const isEmailOk = validateEmail(email);
      if (!isEmailOk) {
        setToast({ state: "failed", text: "Please enter correct email." });
        setSubmit(false);
        return;
      }
      if (password.length < 6) {
        setToast({ state: "failed", text: "Password should have minimum 6 characters." });
        setSubmit(false);
        return;
      }
      if (password != matchingPassword) {
        setToast({ state: "failed", text: "Passwords should match." });
        setSubmit(false);
        return;
      }


      const fireAsync = async () => {
        const res = await registerUserWithCred(password, email,dispatch);
        if (!res) {
          setToast({ state: "failed", text: "Email is already used." });
          setSubmit(false);
          return
        }
        if (res) {
          setToast({ state: "success", text: "Registered succesfuly" });
          window.location.href = "/app";
          return;
        }
      };
      fireAsync();
    }
  }, [submit]);
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg animated">
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white ">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4 fs-3">Registration</span>
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <GoogleButton text={"REGISTER WITH GOOGLE"} />
          --OR--
          <input
            type="text"
            className="form-control rounded-1 greyBtn mt-2"
            placeholder="CHOOSE USERNAME *"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onBlur={(e) => {
              handleFieldValidation(e.target.value, validateUsername, "Username should have minimum 3 characters.", setUserName);
              return;
            }}
          />
          <input
            type="text"
            className="form-control mt-3 rounded-1 greyBtn"
            placeholder="E-MAIL *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => {
              handleFieldValidation(e.target.value, validateEmail, "Please enter correct email.", setEmail);
              return;
            }}
          />
          <Password
            setvalue={setPassword}
            value={password}
            message="Password should have minimum 6 characters."
            customValidation={validatePassword}
            key="aklshdandklandklasdasansdklnaskld"
            placeholder="PASSWORD *"
          />
          <Password
            setvalue={setMatchingPassword}
            value={matchingPassword}
            key="aklshdandklandklansdklnaskld"
            message="Passwords should match."
            customValidation={()=>{}}
            placeholder="MATCHING PASSWORD *"
          />
        </div>

        <div
          onClick={() => setSubmit(true)}
          className="col-6 greyBtn btnShadow text-dark rounded-pill p-2 d-flex flex-column justify-content-center align-items-center mt-5"
        >
          <ButtonLoader state={submit} text="SUBMIT" />
        </div>
        <a href="/" className="text-white mt-5">
          User-Login
        </a>
      </div>
    </div>
  );
};
export default Register;
