import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelMatch, findMatchByCode, getUserProfile, getUserProfileByCode } from "../../firebase";
import { setPartnerImage, setPendingMatchStatus, setSecretCode } from "../../Redux/Utils";
import { changeViewState, setToast } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import "./UserProfile.css";
const ProfileButton = ({ isLocal, isCurrentMatch, matchSignature, setchangeUser, userID, partnerID, secretCode }) => {
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const hasPendingMatch = useSelector((state) => state.user.hasPendingMatch);

  const dispatch = useDispatch();
  const [reinvite, setReinvite] = useState(false);
  useEffect(() => {
    if (reinvite) {
      console.log("here")
      setPendingMatchStatus(dispatch, "");
      console.log(secretCode)
      findMatchByCode(secretCode, userID, matchSignature, partnerID).then(async (res) => {
        
        if (!res) {
          setReinvite(false);
          return;
        }
        setToast({ state: "success", text: "Partner found!" });
        setPartnerImage(dispatch, res.partner?.profileImageUrl);
        setSecretCode(dispatch, secretCode);
        changeViewState(2);
        setReinvite(false);

      });
    }
  }, [reinvite]);

  if (isLocal) {
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        <div
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill   p-2 midFont pointer mt-2"
          onClick={() => setchangeUser((prev) => !prev)}
        >
          <span className="">SWITCH</span>
          <img src="/assets/icons/switch.svg" height="18" width="18" />
        </div>
        <div
          onClick={() => changeViewState(1)}
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-3 midFont pointer"
        >
          Back
        </div>
      </div>
    );
  }
  if (isCurrentMatch) {
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        {/* <div
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill   p-2 midFont pointer mt-2"
          onClick={() => setchangeUser((prev) => !prev)}
        >
          <span className="">SWITCH</span>
          <img src="/assets/icons/switch.svg" height="18" width="18" />
        </div> */}
        <div
          onClick={() => cancelMatch(userID, "approved", "done", matchSignature, partnerID, hasActiveGame)}
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-3 midFont pointer"
        >
          END CONNECTION
        </div>
      </div>
    );
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
      {!hasPendingMatch && !hasActivePartner && <div className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill   p-2 midFont pointer mt-2" onClick={() => setReinvite(true)}>
        {/* <ButtonLoader state={reinvite} text="Invite Again"/> */}
        <span className="">Invite Again</span>
      </div>}

      {/* <div
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill   p-2 midFont pointer mt-2"
        onClick={() => setchangeUser((prev) => !prev)}
      >
        <span className="">SWITCH</span>
        <img src="/assets/icons/switch.svg" height="18" width="18" />
      </div> */}
      <div
        onClick={() => changeViewState(1)}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-3 midFont pointer"
      >
        Back
      </div>
    </div>
  );
};
const UserProfile = () => {
  window.history.pushState({ appState: "5" }, "pushManageStore", "");

  const partnerID = useSelector((state) => state.user.partnerID);
  const userID = useSelector((state) => state.user.userID);
  const matchSignature = useSelector((state) => state.user.matchSignature);

  const [user, setUser] = useState({});
  const [changeUser, setchangeUser] = useState(false);
  const [isCurrentMatch, setIsCurrentMatch] = useState(false);
  const [isLocal, setisLocal] = useState(false);

  useEffect(() => {
    console.log("userID", userID);
    console.log("partnerID", partnerID);
    console.log("matchSignature", matchSignature);

    getUserProfile(changeUser ? userID : partnerID).then((res) => {
      if (!res) {
        setisLocal(true);
        return;
      }
      console.log(res);
      console.log("res.matchSignature", res.matchSignature);

      if (res.matchSignature === matchSignature) {
        setIsCurrentMatch(true);
      }
      if (!matchSignature) {
        setIsCurrentMatch(false);
      }
      if (res.matchSignature != matchSignature || changeUser) {
        setIsCurrentMatch(false);
        // setisLocal(true)
      }
      setUser(res);
      console.log("res",res);
    });
  }, [changeUser]);

  if (!user.hasOwnProperty("profile")) {
    return <ButtonLoader state={true} />;
  }
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end profileContainer">
      {/* profile image control */}
      <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative userProfileContainer">
        <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative">
          <img src={user.profileImageUrl} className="userProfileImage" />
          <span className="indicatorLg position-absolute" />
        </div>
        <span className="">{user.profile.username}</span>
        <span className="w-5">{user.profile.age}</span>
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        <span className="col-12 text-start w-5">Little About Me</span>
        <span className="col-12 text-start midFont">{user.profile.about}</span>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-3">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">Gender</span>
          <span className="col-12 text-start midFont">{user.profile.gender}</span>
        </div>
        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">interested in:</span>
          <span className="col-12 text-start midFont">{user.profile.interestedIn}</span>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
        <span className="col-12 text-start w-5">Country</span>
        <span className="col-12 text-start">{user.profile.country}</span>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
        <span className="col-12 text-start w-5">Your {isCurrentMatch ? "Partner" : ""} sentence</span>
        <span className="col-12 text-start">{user.profile.mySentence}</span>
      </div>
      <ProfileButton
        isCurrentMatch={isCurrentMatch}
        isLocal={isLocal}
        matchSignature={matchSignature}
        setchangeUser={setchangeUser}
        userID={userID}
        partnerID={partnerID}
        secretCode={user.secretCode}
      />
    </div>
  );
};

export default UserProfile;
