import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMatchesList } from "../../firebase";
import { setPartnerID, setSecretCode } from "../../Redux/Utils";
import { changeViewState } from "../../Utils";
import "./ChoosePartner.css";
import ChoosePartnerPopup from "./ChoosePartnerPopup";
const ChoosePartner = () => {
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.user.userID);
  const [showPopup, setShowPopup] = useState(false);
  const [partnersList, setpartnersList] = useState([]);

  const fireAsync = async () => {
    const res = await getMatchesList(userID);
    if (!res) {
      return;
    }
    console.log(res)
    setpartnersList(res);
  };

  useEffect(() => {
    if (userID) {
      fireAsync(userID);
    }
  }, [userID]);
  const handleUserClick = (code) => {
    setPartnerID(dispatch, code);
    changeViewState(5);
  };
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end profileContainer position-relative">
      {/* add user connection popup */}
      {showPopup && <ChoosePartnerPopup setShowPopup={setShowPopup} />}
      <span className="mb-5 mt-5 fs-3">Choosing My Partner</span>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center greyBtn rounded">
        <div
          className="col-11 d-flex flex-row justify-content-center align-items-center border-bottom border-white pointer"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <span className="col smFont">Add New Connection</span>
          <span className="col-auto">+</span>
        </div>
        <div className="col-12 d-flex flex-column justify-content-start align-items-center greyBtn friendsList">
          {/* added users list */}
          {partnersList.map((el, idx) => {
            return (
              <div
                onClick={() => handleUserClick(el.partnerID)}
                className="col-11 d-flex flex-row justify-content-center align-items-center mt-2 border-bottom mb-1"
              >
                <span className="col">{el?.profile?.username}</span>
                <div className="col d-flex flex-row justify-content-end align-items-center">
                  <span className={`${el.userActive ? "indicatorLg" : "bg-danger"} me-2`} />
                  <img src={el?.profileImageUrl} className="profileImageSm mb-1" />
                </div>
              </div>
            );
          })}
        </div>
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
