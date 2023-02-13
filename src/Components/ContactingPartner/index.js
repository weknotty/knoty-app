import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApproveMatch, cancelMatch, createNewMatch, findMatchByCode } from "../../firebase";
import { changeViewState, setToast } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import "./ContactingPartner.css";

const ConnectionImage = ({ state }) => {
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

const ApproveButton = ({ status, onApproveMatch, submit, userID, matchSignature, partnerID }) => {
  if (submit) {
    return <ButtonLoader state={true} />;
  }
  if (!status) {
    console.log("here");
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        <div
          onClick={onApproveMatch}
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
          disabled={true}
        >
          APPROVE
        </div>

        <div
          onClick={() => changeViewState(1)}
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
        >
          CANCEL REQUEST
        </div>
      </div>
    );
  }
  if (status === "approved") {
    return (
      <div
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
        disabled={true}
      >
        WAITING FOR APPROVAL
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        <div
          onClick={onApproveMatch}
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
          disabled={true}
        >
          APPROVE
        </div>

        <div
          onClick={() => cancelMatch(userID, "pending", "rejected", matchSignature, partnerID)}
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
        >
          CANCEL REQUEST
        </div>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div
        // onClick={onApproveMatch}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
        disabled={true}
      >
        GO BACK
      </div>
    );
  }
};
const ContactingPartner = () => {
  const currentUser = useSelector((state) => state.user);
  const userID = useSelector((state) => state.user.userID);
  const partnerID = useSelector((state) => state.user.partnerID);
  const matchSignature = useSelector((state) => state.user.matchSignature);
  const partnerImage = useSelector((state) => state.user.partnerImage);
  const secretCode = useSelector((state) => state.user.secretCode);
  const pendingMatchStatus = useSelector((state) => state.user.pendingMatchStatus);
  const [submit, setSubmit] = useState(false);

  const onApproveMatch = () => {
    if (!pendingMatchStatus) {
      setSubmit(true);
      findMatchByCode(secretCode, currentUser.userID, matchSignature, partnerID).then(async (res) => {
        await createNewMatch(currentUser.userID, res.partner.id, res.user, res.partner).catch((err) => console.log(err));
        changeViewState(0);
      });
      return;
    }
    if (pendingMatchStatus == "approved") {
      console.log("approved here disable button");
      return;
    }
    if (pendingMatchStatus == "pending") {
      findMatchByCode(secretCode, currentUser.userID, matchSignature, partnerID).then(async (res) => {
        console.log("res",res)
        await ApproveMatch(currentUser.userID, res.partner.id).catch((err) => console.log(err));
        console.log(res);
        // changeViewState(0);
      });
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
      <ApproveButton
        onApproveMatch={onApproveMatch}
        status={pendingMatchStatus}
        submit={submit}
        matchSignature={matchSignature}
        partnerID={partnerID}
        userID={userID}
      />

      <span onClick={() => changeViewState(0)} className="smFont mt-2 w-5 text-decoration-underline">
        back
      </span>
    </div>
  );
};

export default ContactingPartner;
