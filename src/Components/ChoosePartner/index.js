import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMatchesList } from "../../firebase";
import { setPartnerID, setSecretCode } from "../../Redux/Utils";
import { changeViewState, setToast } from "../../Utils";
import OnlinePartners from "../OnlinePartners";
import "./ChoosePartner.css";
import ChoosePartnerPopup from "./ChoosePartnerPopup";
const ChoosePartner = () => {
  window.history.pushState({ appState: "0" }, "pushManageStore", "");
  const userID = useSelector((state) => state.user.userID);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const [showPopup, setShowPopup] = useState(false);
  const [partnersList, setpartnersList] = useState([]);

  useEffect(() => {
    if (userID) {
      getMatchesList(userID)
        .then((res) => {
          if (!res) {
            return;
          }
          setpartnersList(res);
        })
        .catch((err) => console.log(err));
    }
  }, [userID]);

  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end profileContainer position-relative">
      {/* add user connection popup */}
      {showPopup && <ChoosePartnerPopup setShowPopup={setShowPopup} />}
      <span className="mb-5 mt-5 fs-3">Choosing My Partner</span>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center greyBtn rounded">
        <div
          className="col-11 d-flex flex-row justify-content-center align-items-center border-bottom border-white pointer"
          onClick={() => {
            if (hasActivePartner) {
              setToast({ state: "warning", text: "You already have an active partner." });
              return;
            }
            setShowPopup((prev) => !prev);
          }}
        >
          <span className="col smFont">Add New Connection</span>
          <span className="col-auto">+</span>
        </div>
        <OnlinePartners partnersList={partnersList} />
      </div>
      <div
        onClick={() => changeViewState(0)}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-3 midFont pointer"
      >
        OK, THAT'S IT
      </div>
      <div
        onClick={() => changeViewState(0)}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 mb-1 midFont pointer"
      >
        CANCEL
      </div>
    </div>
  );
};

export default ChoosePartner;
