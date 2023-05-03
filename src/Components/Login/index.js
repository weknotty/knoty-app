import { useEffect, useState } from "react";
import FacebookButton from "../FacebookButton";
import GoogleButton from "../GoogleButton";
import Welcome from "../Welcome";
const Login = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  }, []);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      window.sessionStorage.setItem("codeTemp", code);
    }
  }, []);

  if (showAnimation) {
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        <Welcome />
      </div>
    );
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg">
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white animated">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4">
          text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text
          text text text text text
        </span>
        <GoogleButton text="LOGIN WITH GOOGLE" width={10}/>
        <FacebookButton text="LOGIN WITH FACEBOOK" />
        <a
          href="/login"
          className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3 pointer"
          style={{ textDecoration: "unset" }}
        >
          <span className="col-8 text-start w-4">USER LOGIN</span>
          <img src="/assets/icons/login.svg" height="30" width="30" />
        </a>
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
export default Login;
