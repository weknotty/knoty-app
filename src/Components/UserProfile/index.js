import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cancelMatch, getUserProfile, getUserProfileByCode } from "../../firebase";
import { changeViewState } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import "./UserProfile.css";
const ProfileButton = ({ isLocal, isCurrentMatch, matchSignature, setchangeUser, userID, partnerID }) => {
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
  console.log(hasActiveGame);
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
        <div
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill   p-2 midFont pointer mt-2"
          onClick={() => setchangeUser((prev) => !prev)}
        >
          <span className="">SWITCH</span>
          <img src="/assets/icons/switch.svg" height="18" width="18" />
        </div>
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
    getUserProfile(changeUser ? userID : partnerID).then((res) => {
      if (!res) {
        setisLocal(true);
        return;
      }
      if (res.matchSignature == matchSignature) {
        setIsCurrentMatch(true);
      }
      if (res.matchSignature != matchSignature || changeUser) {
        setIsCurrentMatch(false);
        setisLocal(true)
      }
      setUser(res);
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
          <span className="col-12 text-start midFont">{user.profile.interstedIn}</span>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
        <span className="col-12 text-start w-5">Country</span>
        <span className="col-12 text-start">{user.profile.country}</span>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
        <span className="col-12 text-start w-5">His sentence</span>
        <span className="col-12 text-start">{user.profile.mySentence}</span>
      </div>
      <ProfileButton
        isCurrentMatch={isCurrentMatch}
        isLocal={isLocal}
        matchSignature={matchSignature}
        setchangeUser={setchangeUser}
        userID={userID}
        partnerID={partnerID}
      />
    </div>
  );
};

export default UserProfile;
