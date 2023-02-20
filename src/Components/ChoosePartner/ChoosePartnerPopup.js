import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {findMatchByCode } from "../../firebase";
import { setPartnerImage, setPendingMatchStatus, setSecretCode } from "../../Redux/Utils";
import { changeViewState, setToast } from "../../Utils";
import "./ChoosePartner.css";

const ChoosePartnerPopup = ({ setShowPopup }) => {
  const [secretCode, setSecretCodeLocal] = useState("");
  const [submit, setSubmit] = useState(false);
  const userID = useSelector((state) => state.user.userID);
  const matchSignature = useSelector((state) => state.user.matchSignature);
  const partnerID = useSelector((state) => state.user.partnerID);

  const dispatch = useDispatch();


  // invitation code
  useEffect(()=>{
      const item = window.sessionStorage.getItem("codeTemp");
      if(item){
        setSecretCodeLocal(item);
        window.sessionStorage.removeItem("codeTemp");
      }
  },[])

  // code handler
  useEffect(() => {
    if (submit) {
      if (secretCode.length < 6) {
        setToast({ state: "warning", text: "Code is not compatible." });
        setSubmit(false);
        return;
      }
      setPendingMatchStatus(dispatch, "");
      findMatchByCode(secretCode, userID, matchSignature, partnerID).then(async (res) => {
        if (!res) {
          setSubmit(false);
          return;
        }
        setToast({ state: "success", text: "Match found!" });
        setPartnerImage(dispatch, res.partner?.profileImageUrl);
        setSecretCode(dispatch, secretCode);
        changeViewState(2);
      });
    }
  }, [submit, matchSignature]);

  return (
    <div className="col-10 d-flex flex-column justify-content-center align-items-center greyBtn btnShadow addConnectionPopup" id="addConnectionPopup">
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <div className="col-12 d-flex flex-row justify-content-center align-items-center">
            <span className="col-10">Enter your connection secret</span>
          </div>
          <div className="col-10 d-flex flex-column justify-content-center align-items-center">
            <input type="text" value={secretCode} className="form-control" placeholder="Enter code" onChange={(e) => setSecretCodeLocal(e.target.value)} />
          </div>
          <div className="col-10 d-flex flex-row justify-content-center align-items-center">
            <div
              onClick={() => setSubmit(true)}
              className="col me-1 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill mt-2 p-1 mb-3 midFont pointer"
            >
              SUBMIT
            </div>
            <div
              className="col d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill mt-2 p-1 mb-3 midFont pointer "
              onClick={() => setShowPopup((prev) => !prev)}
            >
              CLOSE
            </div>
          </div>
        </div>

    </div>
  );
};

export default ChoosePartnerPopup;
