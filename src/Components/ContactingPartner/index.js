import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createNewMatch, findMatchByCode } from "../../firebase";
import { changeViewState, setToast } from "../../Utils";
import "./ContactingPartner.css";

const ConnectionImage = ({ state }) => {
  console.log("state", state);
  if (!state) {
    return <img src="/assets/icons/waitingForPartner.svg" className="col" height="15" />;
  }
  if (state === "approved") {
    return <img src="/assets/icons/partnerApprove.svg" className="col" height="15" />;
  }
  if (state === "pending") {
    return <img src="/assets/icons/partnerApprove.svg" style={{ transform: "rotateY(180deg)" }} className="col" height="15" />;
  }
};

const ApproveButton = ({ status, onApproveMatch }) => {
  if (!status) {
    return (
      <div
        onClick={onApproveMatch}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
      >
        OK, THAT'S IT
      </div>
    );
  }
  if (status === "approved") {
    <div
      className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
      disabled={true}
    >
      WAITING FOR APPROVAL
    </div>;
  }
  if (status === "pending") {
    return (
      <div
        onClick={onApproveMatch}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
        disabled={true}
      >
        APPROVE
      </div>
    );
  }
};
const ContactingPartner = () => {
  const currentUser = useSelector((state) => state.user);
  const partnerImage = useSelector((state) => state.user.partnerImage);
  const secretCode = useSelector((state) => state.user.secretCode);
  const pendingMatchStatus = useSelector((state) => state.user.pendingMatchStatus);



  const onApproveMatch = () => {
    if (!pendingMatchStatus) {
      findMatchByCode(secretCode, currentUser.userID).then(async (res) => {
        await createNewMatch(currentUser.userID, res.partner.id, res.user, res.partner).catch((err) => console.log(err));
        console.log(res);
      });
      return;
    }
    if (pendingMatchStatus == "approved") {
      console.log("approved here disable button");
      return;
    }
    if (pendingMatchStatus == "pending") {
      console.log("needs to approve here and send match");
      return;
    }
  };


  
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end ">
      <div className="col-11 d-flex flex-row justify-content-center align-items-center profileContainer">
        <img src={currentUser?.profileImageUrl} className="profileImageMid" />
        {/* <img src="/assets/icons/waitingForPartner.svg" className="col" height="15" /> */}
        <ConnectionImage state={pendingMatchStatus} />
        <img src={partnerImage} className="profileImageMid" />
      </div>
      <ApproveButton onApproveMatch={onApproveMatch} status={pendingMatchStatus} />
      <div
        onClick={() => changeViewState(0)}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
      >
        CANCEL REQUEST
      </div>
      <span onClick={() => changeViewState(0)} className="smFont mt-2 w-5 text-decoration-underline">back</span>
    </div>
  );
};

export default ContactingPartner;
