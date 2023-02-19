import { useState } from "react";
import { useSelector } from "react-redux";
import { ApproveMatch, createNewMatch, findMatchByCode } from "../../firebase";
import { changeViewState } from "../../Utils";
import ApproveButton from "../ApproveButton";
import ConnectionImage from "../ConnectionImage";
import "./ContactingPartner.css";

const ContactingPartner = () => {
  window.history.pushState({ appState: "1" }, "pushManageStore", "");

  const currentUser = useSelector((state) => state.user);
  const userID = useSelector((state) => state.user.userID);
  const partnerID = useSelector((state) => state.user.partnerID);
  const matchSignature = useSelector((state) => state.user.matchSignature);
  const partnerImage = useSelector((state) => state.user.partnerImage);
  const secretCode = useSelector((state) => state.user.secretCode);
  const pendingMatchStatus = useSelector((state) => state.user.pendingMatchStatus);
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
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
      return;
    }
    if (pendingMatchStatus == "pending") {
      findMatchByCode(secretCode, currentUser.userID, matchSignature, partnerID).then(async (res) => {
        if (!res) {
          setSubmit(false);
          return;
        }
        await ApproveMatch(res.partner.matchSignature).catch((err) => console.log(err));
        changeViewState(0);
      });
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
        hasActiveGame={hasActiveGame}
      />

      <span onClick={() => changeViewState(0)} className="smFont mt-2 w-5 text-decoration-underline">
        back
      </span>
    </div>
  );
};

export default ContactingPartner;
