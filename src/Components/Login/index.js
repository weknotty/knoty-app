import { useEffect, useState } from "react";
import { loginWithGoogle } from "../../firebase";
import GoogleButton from "../GoogleButton";
import Welcome from "../Welcome";
const Login = () => {
  const [googleSignin, setGoogleSignin] = useState(false);
  const [appleSignin, setAppleSignin] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  useEffect(()=>{
    setTimeout(() => {
      setShowAnimation(false)
    }, 1500);
  },[])

  useEffect(() => {
    if (googleSignin) {
      const fireAsync = async () => {
        const isLogged = await loginWithGoogle();
        console.log(isLogged.user);
        console.log(isLogged);

        if (isLogged) {
          const fireAsync = async () => {
            window.location.href = "/app";
          };
          fireAsync();
        }
      };
      fireAsync();
      setGoogleSignin(false);
    }
  }, [googleSignin]);
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
        <GoogleButton text="LOGIN WITH GOOGLE"/>
        <div className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3">
          <span className="col-8 text-start w-4">LOG IN WITH FACEBOOK</span>
          <img src="/assets/icons/facebook.svg" height="30" width="30" />
        </div>
        <a
          href="/login"
          className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3"
          style={{ textDecoration: "unset" }}
        >
          <span className="col-8 text-start w-4">USER LOGIN</span>
          <img src="/assets/icons/login.svg" height="25" width="25" />
        </a>

        <a href="/register" className="text-white mt-5">
          REGISTRATION
        </a>
      </div>
    </div>
  );
};
export default Login;
