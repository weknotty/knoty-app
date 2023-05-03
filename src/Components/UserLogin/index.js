import { createRef, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleNewEntry, loginWithEmail, loginWithGoogle } from "../../firebase";
import { setToast, validateEmail, validatePassword } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import Password from "../Password";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const passwordRef = createRef();
  const userRef = createRef();

  useEffect(() => {
    if (submit) {
      const isEmailOK = validateEmail(email);
      const isPasswordOK = validatePassword(password);
      if (!email || !isEmailOK) {
        setToast({ state: "failed", text: "Please enter correct email." });
        setSubmit(false);
        userRef.current.classList.add("border-danger","border-5");
        userRef.current.classList.remove("border-0");
        return;
      }
      if (!password || !isPasswordOK) {
        setToast({ state: "failed", text: "Password is required." });
        passwordRef.current.classList.add("border-danger","border-5");
        passwordRef.current.classList.remove("border-0");

        console.log(passwordRef)
        setSubmit(false);
        return;
      }
      const fireAsync = async () => {
        const res = await loginWithEmail(email, password);
        if (!res) {
          setToast({ state: "failed", text: "Login details are incorrect." });
          setSubmit(false);
        }
        if (res) {
          setToast({ state: "success", text: "Logged-in succesfuly" });
          window.location.href = "/app";
          return;
        }
      };
      fireAsync();
    }
  }, [submit]);

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg ">
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white animated">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4 fs-3">User Login</span>
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control rounded-1 greyBtn" placeholder="EMAIL *" ref={userRef} />
          <Password
            customValidation={validatePassword}
            message="Password should have minimum 6 characters."
            placeholder="PASSWORD *"
            setvalue={setPassword}
            value={password}
            currentRef={passwordRef}
          />
          <a href="/forgotpass" className="text-white align-self-start mt-3">
            Forgot Password
          </a>
        </div>
        <div className="col-10 d-flex flex-row justify-content-center align-items-center mt-5">
          <input type="checkbox" className="form-check-input p-2 align-self-center" />
          <span className="mt-1 ms-2">Remember Me</span>
        </div>
        <div
          onClick={() => setSubmit(true)}
          className="col-6 greyBtn btnShadow text-dark rounded-pill p-2 d-flex flex-column justify-content-center align-items-center mt-5"
        >
          <ButtonLoader state={submit} text="APPROVAL" />
        </div>
        <div className="col-12 smFont m-1 d-flex flex-column justify-content-center align-items-center">
          By continuing you are agreeing to our{" "}
          <div className='col-12 d-flex flex-row justify-content-center align-items-center'>
          <a href="/assets/termsofuse.html" className="m-1 text-dark" target="_blank">
            Terms of use
          </a>{" "}
          and{" "}
          <a href="/assets/disclaimer.html" className="m-1 text-dark" target="_blank">
            Legal disclaimer
          </a>
          </div>
        </div>
        <a href="/register" className="text-white mt-5">
          REGISTRATION
        </a>
      </div>
    </div>
  );
};
export default UserLogin;
