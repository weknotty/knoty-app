import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { approveManual, resetPassword } from "../../firebase";
import { changeViewState, setToast, validateEmail } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import "./ForgotPass.css";
const ForgotPass = () => {
  const userID = useSelector((state) => state.user.userID);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  useEffect(() => {
    if (submit) {
      const isEmailOk = validateEmail(email);
      if (!isEmailOk) {
        setToast({ state: "failed", text: "Please enter correct email." });
        setSubmit(false);
        return;
      }
      resetPassword(email).then(() => {
        setSubmit(false);
      });
      // const fireAsync = async () => {
      //   const res = await registerUserWithCred(password, email, dispatch);
      //   if (!res) {
      //     setToast({ state: "failed", text: "Email is already used." });
      //     setSubmit(false);
      //     return;
      //   }
      //   if (res) {
      //     setToast({ state: "success", text: "Registered succesfuly" });
      //     window.location.href = "/app";
      //     return;
      //   }
      // };
      // fireAsync();
    }
  }, [submit]);
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg ">
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white animated">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4 fs-3">Reset Password</span>
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control rounded-1 greyBtn" placeholder="EMAIL *" />
        </div>

        <div
          className="col-6 greyBtn btnShadow text-dark rounded-pill p-2 d-flex flex-column justify-content-center align-items-center mt-5 pointer"
          onClick={() => setSubmit(true)}
        >
          <ButtonLoader state={submit} text="APPROVAL" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
