import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransitionGroup } from "react-transition-group";
import { getUserProfile, updateProfileData } from "../../firebase";
import { changeViewState, handleUploadChange, setToast } from "../../Utils";
import "./EditProfile.css";
import countries from "../../countries.json";
import ButtonLoader from "../ButtonLoader";
import PreviewImage from "../PreviewImage";
import { setActivePartner, setProfileImageUrl } from "../../Redux/Utils";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState("");
  const [interestedIn, setInterestedIn] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [mySentence, setMySentence] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [submit, setSubmit] = useState(false);
  const [isReady, setisReady] = useState(false);

  // const userSelector = useSelector((state) => state.user);
  const userID = useSelector((state) => state.user.userID);
  const dispatch = useDispatch();

  const handleProfileErrors = (value) => {
    setToast({ state: "warning", text: value });
    return;
  };

  useEffect(() => {
    // fore back button
    window.history.pushState({ appState: "0" }, "pushManageStore", "");

    // load profile
    const fireAsync = async () => {
      const userProfile = await getUserProfile(userID);
      setProfileImageUrl(dispatch, userProfile?.profileImageUrl);
      setActivePartner(dispatch,userProfile?.hasActivePartner)
      setSecretCode(userProfile?.secretCode);
      if (userProfile.hasOwnProperty("profile")) {
        const profile = userProfile?.profile;
        setUsername(profile?.username);
        setAbout(profile?.about);
        setGender(profile?.gender);
        setInterestedIn(profile?.interestedIn);
        setAge(profile?.age);
        setCountry(profile?.country);
        setMySentence(profile?.mySentence);
        setisReady(true);
      } else {
        setisReady(true);
      }
    };
    if (userID) {
      fireAsync();
    }
  }, [userID]);

  useEffect(() => {
    if (submit) {
      if (!username || username.length < 3) {
        handleProfileErrors("Username should have minimum 3 characters.");
        setSubmit(false);
        return;
      }
      if (!gender) {
        handleProfileErrors("Please select your gender.");
        setSubmit(false);
        return;
      }
      if (!interestedIn) {
        handleProfileErrors("Please select your intersted type.");
        setSubmit(false);
        return;
      }
      if (!age) {
        handleProfileErrors("Please define your age.");
        setSubmit(false);
        return;
      }
      if (!country) {
        handleProfileErrors("Please define your country.");
        setSubmit(false);
        return;
      }
      const payload = {
        username,
        about,
        gender,
        interestedIn,
        age,
        country,
        mySentence,
      };
      updateProfileData(userID, payload).then(() => {
        setSubmit(false);
        return;
      });
    }
  }, [submit]);

  if (!userID || !isReady) {
    return <ButtonLoader state={true} text="Loading..." />;
  }
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-xxl-between justify-content-xl-between justify-content-lg-between justify-content-md-end justify-content-sm-end justify-content-end align-items-center align-self-end profileContainer">
      {/* profile image control */}
      <PreviewImage />
      {/* about */}
      <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-3">
        <span className="col-12 text-start w-5">My Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control greyBtn border-0"
          placeholder="Write something..."
        />
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-3">
        <span className="col-12 text-start w-5">Little About Me</span>
        <textarea
          type="text"
          className="form-control greyBtn border-0 aboutMeText rounded-3"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Write something..."
        />
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mb-2">
        {/* gender */}

        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select border-0  greyBtn">
            <option value="">Choose</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non">Not-identified</option>
          </select>
        </div>
        {/* interests */}
        <div className="col d-flex flex-column justify-content-center align-items-center ms-2 ">
          <span className="col-12 text-start w-5">Interested-In:</span>
          <select value={interestedIn} onChange={(e) => setInterestedIn(e.target.value)} className="form-select border-0  greyBtn">
            <option value="0">Choose</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mb-2">
        {/* age */}
        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">My Age</span>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9.]/g, ""))}
            pattern="[0-9]+"
            type="text"
            className="form-control  greyBtn border-0"
            placeholder="Your age"
          />
        </div>
        {/* country */}
        <div className="col d-flex flex-column justify-content-center align-items-center ms-2">
          <span className="col-12 text-start w-5">Country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="form-select border-0  greyBtn">
            <option value="0">Choose</option>
            {countries.map((el) => {
              const lowered = el.name;
              return <option value={lowered}>{lowered}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-2">
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">My Sentence</span>
          <input
            type="text"
            className="form-control greyBtn border-0"
            value={mySentence}
            onChange={(e) => setMySentence(e.target.value)}
            placeholder="Write something..."
          />
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-2">
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5 text-muted">My Secret Code</span>
          <input type="text" className="form-control greyBtn border-0 text-muted" value={secretCode} disabled={true} />
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-3">
        <div
          className="col-8 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 me-2 midFont pointer"
          onClick={() => changeViewState(1)}
        >
          CHOOSING A PARTNER
        </div>
        <div
          className="col d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 midFont pointer"
          onClick={() => setSubmit(true)}
        >
          SAVE
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 mt-3 text-muted mb-3 midFont pointer">
        DELETE ACCOUNT
      </div>
    </div>
  );
};

export default EditProfile;
