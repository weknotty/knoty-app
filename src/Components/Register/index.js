import { createRef, useEffect, useState } from "react";
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
  const dispatch = useDispatch();
  const passwordRef = createRef();
  const userRef = createRef();
  const emailRef = createRef();
  const [isOver18, setisOver18] = useState(null);

  useEffect(() => {
    if (submit) {
      if (!userName || userName.length < 3) {
        setToast({ state: "failed", text: "Username should have minimum 3 characters." });
        setSubmit(false);
        userRef.current.classList.add("border-danger", "border-5");
        userRef.current.classList.remove("border-0");
        return;
      }
      const isEmailOk = validateEmail(email);
      if (!isEmailOk) {
        setToast({ state: "failed", text: "Please enter correct email." });
        setSubmit(false);
        emailRef.current.classList.add("border-danger", "border-5");
        emailRef.current.classList.remove("border-0");
        return;
      }
      if (password.length < 6 || matchingPassword.length < 6) {
        setToast({ state: "failed", text: "Password should have minimum 6 characters." });
        setSubmit(false);
        passwordRef.current.classList.add("border-danger", "border-5");
        passwordRef.current.classList.remove("border-0");
        return;
      }
      if (password != matchingPassword) {
        setToast({ state: "failed", text: "Passwords should match." });
        setSubmit(false);
        passwordRef.current.classList.add("border-danger", "border-5");
        passwordRef.current.classList.remove("border-0");
        return;
      }
      if (!isOver18) {
        setToast({ state: "failed", text: "You have to be minimum 18 years old." });
        setSubmit(false);

        return;
      }
      const fireAsync = async () => {
        const res = await registerUserWithCred(password, email, dispatch);
        if (!res) {
          setToast({ state: "failed", text: "Email is already used." });
          setSubmit(false);
          return;
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
  useEffect(() => {
    const modal = document.getElementById("ageModal");

    if (isOver18 === null) {
      window.$(modal).modal("show");

      return;
    }
    if (isOver18 !== null && !isOver18) {
      window.location.href = "/";
      return;
    }
    if (isOver18) {
      window.$(modal).modal("hide");
      setisOver18(true);
    }
  }, [isOver18]);
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg animated">
      <div class="modal fade" id="ageModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5 text-center" id="exampleModalLabel">
                Verify your age
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center w-5">Are you over 18 years old?</div>
            <div class="modal-footer d-flex flex-row justify-content-center align-items-center">
              <button type="button" class="btn pinkBorder" onClick={() => setisOver18(true)}>
                Yes,I'm over 18
              </button>
              <button type="button" class="btn btn-secondary" onClick={() => setisOver18(false)}>
                Take me back
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white ">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4 fs-3">Registration</span>
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <GoogleButton text={"REGISTER WITH GOOGLE"}  width={"12"}/>
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
            ref={userRef}
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
            ref={emailRef}
          />
          <Password
            setvalue={setPassword}
            value={password}
            message="Password should have minimum 6 characters."
            customValidation={validatePassword}
            key="aklshdandklandklasdasansdklnaskld"
            placeholder="PASSWORD *"
            currentRef={passwordRef}
          />
          <Password
            setvalue={setMatchingPassword}
            value={matchingPassword}
            key="aklshdandklandklansdklnaskld"
            message="Passwords should match."
            customValidation={() => {}}
            placeholder="MATCHING PASSWORD *"
            currentRef={passwordRef}
          />
        </div>

        <div
          onClick={() => setSubmit(true)}
          className="col-6 greyBtn btnShadow text-dark rounded-pill p-2 d-flex flex-column justify-content-center align-items-center mt-5 pointer"
        >
          <ButtonLoader state={submit} text="SUBMIT" />
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
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <a href="/" className="text-white mt-5 pointer">
            User-Login
          </a>
          <a href="/forgotpass" className="text-white align-self-center mt-3">
            Forgot Password
          </a>
        </div>
      </div>
    </div>
  );
};
export default Register;
