import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransitionGroup } from "react-transition-group";
import { checkPendingMatches, getUserProfile, updateProfileData } from "../../firebase";
import { changeViewState, handleUploadChange, setToast } from "../../Utils";
import "./EditProfile.css";
import countries from "../../countries.json";
import ButtonLoader from "../ButtonLoader";
import PreviewImage from "../PreviewImage";
import { setActivePartner, setProfileImageUrl } from "../../Redux/Utils";
import * as utils from "../../Redux/Utils";
import PendingMatch from "../PendingMatch";
import MatchName from "../MatchName";
import DeleteAccount from "../DeleteAccount";
import { createRef } from "react";
const genderList = [
  { name: "AgenderAndrogyne" },
  { name: "Androgynous" },
  { name: "Bigender" },
  { name: "Cis" },
  { name: "Cisgender" },
  { name: "Cis Female" },
  { name: "Cis Male" },
  { name: "Cis Man" },
  { name: "Cis Woman" },
  { name: "Cisgender Female" },
  { name: "Cisgender Male" },
  { name: "Cisgender Man" },
  { name: "Cisgender Woman" },
  { name: "Female to Male" },
  { name: "FTM" },
  { name: "Gender Fluid" },
  { name: "Gender Nonconforming" },
  { name: "Gender Questioning" },
  { name: "Gender Variant" },
  { name: "Genderqueer" },
  { name: "Intersex" },
  { name: "Male to Female" },
  { name: "MTF" },
  { name: "Neither" },
  { name: "Neutrois" },
  { name: "Non-binary" },
  { name: "Other" },
  { name: "Pangender" },
  { name: "Trans" },
  { name: "Trans*" },
  { name: "Trans Female" },
  { name: "Trans* Female" },
  { name: "Trans Male" },
  { name: "Trans* Male" },
  { name: "Trans Man" },
  { name: "Trans* Man" },
  { name: "Trans Person" },
  { name: "Trans* Person" },
  { name: "Trans Woman" },
  { name: "Trans* Woman" },
  { name: "Transfeminine" },
  { name: "Transgender" },
  { name: "Transgender Female" },
  { name: "Transgender Male" },
  { name: "Transgender Man" },
  { name: "Transgender Person" },
  { name: "Transgender Woman" },
  { name: "Transmasculine" },
  { name: "Transsexual" },
  { name: "Transsexual Female" },
  { name: "Transsexual Male" },
  { name: "Transsexual Man" },
  { name: "Transsexual Person" },
  { name: "Transsexual Woman" },
  { name: "Two-Spirit" },
];
const EditProfile = () => {
  // set location
  window.history.pushState({ appState: "0" }, "pushManageStore", "");
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
  const [points, setPoints] = useState("");
  const userID = useSelector((state) => state.user.userID);
  const hasPendingMatch = useSelector((state) => state.user.hasPendingMatch);
  const profileFull = useSelector((state) => state.user.profileFull);
  const [countriesFound, setcountriesFound] = useState([]);
  const [countryFound, setcountryFound] = useState("");
  const [isLoadedCountry, setisLoadedCountry] = useState(false);

  const dispatch = useDispatch();

  const handleProfileErrors = (value) => {
    setToast({ state: "warning", text: value });
    return;
  };

  useEffect(() => {
    if (userID) {
      getUserProfile(userID).then((userProfile) => {
        setProfileImageUrl(dispatch, userProfile?.profileImageUrl);
        setActivePartner(dispatch, userProfile?.hasActivePartner);
        setSecretCode(userProfile?.secretCode);
        setisReady(true);
        utils.setProfileFull(dispatch, userProfile.profileFull);
        utils.setHasPendingMatch(dispatch, userProfile.hasPendingMatch);
        window.sessionStorage.setItem("sc", userProfile.secretCode);
        if (userProfile.hasOwnProperty("profile")) {
          const profile = userProfile?.profile;
          setUsername(profile?.username);
          setAbout(profile?.about);
          setGender(profile?.gender);
          setInterestedIn(profile?.interestedIn);
          setAge(profile?.age);
          setCountry(profile?.country);
          setMySentence(profile?.mySentence);
          setPoints(userProfile?.points || "0");
          utils.setUsername(dispatch, profile?.username);
          setcountryFound(true)
        } else {
          setisReady(true);
        }
      });
    }

    if (userID) {
      const showFeeback = window.sessionStorage.getItem("showFeedback");
      if (showFeeback) {
        changeViewState(3);
      }
    }
  }, [userID]);

  useEffect(() => {
    if (submit) {
      if (!username || username.length < 3) {
        handleProfileErrors("Username should have minimum 3 characters.");
        setSubmit(false);
        userRef.current.classList.add("border-danger", "border-2");
        userRef.current.classList.remove("border-0");
        return;
      }
      userRef.current.classList.remove("border-danger", "border-2");

      if (!gender || gender == 0) {
        genderRef.current.classList.add("border-danger", "border-2");
        genderRef.current.classList.remove("border-0");
        handleProfileErrors("Please select your gender.");
        setSubmit(false);
        return;
      }
      genderRef.current.classList.remove("border-danger", "border-2");

      // if (!interestedIn || interestedIn == 0) {
      //   interstedRef.current.classList.add("border-danger", "border-2");
      //   interstedRef.current.classList.remove("border-0");
      //   handleProfileErrors("Please select your intersted type.");
      //   setSubmit(false);
      //   return;
      // }
      interstedRef.current.classList.remove("border-danger", "border-2");
      if (!age || age == 0 || age < 0 || age < 18) {
        ageRef.current.classList.add("border-danger", "border-2");
        ageRef.current.classList.remove("border-0");
        handleProfileErrors("Minimum age is 18.");
        setSubmit(false);
        return;
      }
      ageRef.current.classList.remove("border-danger", "border-2");

      if (!countryFound || countryFound == 0) {
        countryRef.current.classList.add("border-danger", "border-2");
        countryRef.current.classList.remove("border-0");
        handleProfileErrors("Please define your country.");
        setSubmit(false);
        return;
      }
      countryRef.current.classList.remove("border-danger", "border-2");

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
        utils.setUsername(dispatch, username);
        utils.setProfileFull(dispatch, true);
        setSubmit(false);
        return;
      });
    }
  }, [submit]);
  const userRef = createRef();
  const aboutRef = createRef();
  const genderRef = createRef();
  const interstedRef = createRef();
  const ageRef = createRef();
  const countryRef = createRef();
  useEffect(() => {
    if (country) {
      const res = countries.filter((el) => el.name.toLowerCase().includes(country.toLowerCase()));
      console.log(res);
      setcountriesFound(res);
    }
  }, [country]);
  useEffect(() => {
    if (countryFound) {
      setcountriesFound([]);
    }
  }, [countryFound]);

  if (!isReady) {
    return <ButtonLoader state={true} text="Loading..." />;
  }
  <div className="col-12 d-flex flex-column justify-content-center align-items-center position-relative">
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="form-control greyBtn border-0"
      placeholder="Write something..."
      ref={userRef}
    />
  </div>;
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column justify-content-xxl-between justify-content-xl-between justify-content-lg-between justify-content-md-end justify-content-sm-end justify-content-end align-items-center profileContainer">
      {/* profile image control */}

      <PreviewImage />
      <PendingMatch hasPendingMatch={hasPendingMatch} />
      {/* about */}
      <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-3">
        <span className="col-12 text-start w-5">My Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control greyBtn border-0"
          placeholder="Write something..."
          ref={userRef}
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
          ref={aboutRef}
        />
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mb-2">
        {/* gender */}

        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">Gender</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select border-0  greyBtn" ref={genderRef}>
            <option value="0">Choose</option>
            {genderList.map((el) => {
              return <option value={el.name}>{el.name}</option>;
            })}
          </select>
        </div>
        {/* interests */}

        <div className="col d-none flex-column justify-content-center align-items-center ms-2 ">
          <span className="col-12 text-start w-5">Interested-In:</span>
          <select value={interestedIn} onChange={(e) => setInterestedIn(e.target.value)} className="form-select border-0  greyBtn" ref={interstedRef}>
            <option value="0">Choose</option>
            {genderList.map((el) => {
              return <option value={el.name}>{el.name}</option>;
            })}
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
            min="18"
            max="100"
            type="number"
            className="form-control  greyBtn border-0"
            placeholder="Your age"
            ref={ageRef}
          />
        </div>
        {/* country */}
        <div className="col d-flex flex-column justify-content-center align-items-center ms-2">
          <span className="col-12 text-start w-5">Country</span>
          <div className="col-12 d-flex flex-column justify-content-center align-items-center position-relative">
            <input
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
                setcountryFound(false)
              }}
              type="text"
              className="form-control greyBtn border-0"
              placeholder="Search for country"
              ref={countryRef}
            />
            {countriesFound != false && !countryFound && (
              <div
                className="col-12 d-flex flex-column justify-content-center align-items-center  position-absolute greyBtn border-bottom border-top shadow-sm  p-2"
                style={{ top: "100%", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}
              >
                {countriesFound.map((el) => {
                  return (
                    <span
                      className="border-bottom bg-white col-12 text-center rounded w-3 pointer"
                      onClick={() => {
                        setcountryFound(el.name);
                        setCountry(el.name);
                        return;
                      }}
                    >
                      {el.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          {/* <select value={country} onChange={(e) => setCountry(e.target.value)} className="form-select border-0  greyBtn" ref={countryRef}>
            <option value="0">Choose</option>
            {countries.map((el) => {
              const lowered = el.name;
              return (
                <option key={lowered} value={lowered}>
                  {lowered}
                </option>
              );
            })}
          </select> */}
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
      <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-2">
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5 text-muted">Points Earned</span>
          <input type="text" className="form-control greyBtn border-0 text-muted" value={points} disabled={true} />
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-3">
        <div
          className="col-8 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 me-2 midFont pointer"
          onClick={() => {
            if (!profileFull) {
              setToast({ state: "warning", text: "Please fill your profile first." });
              return;
            }
            changeViewState(1);
          }}
          disabled={profileFull}
        >
          CHOOSING A PARTNER
        </div>
        <div
          className="col d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 midFont pointer"
          onClick={() => setSubmit(true)}
        >
          <ButtonLoader state={submit} text="SAVE" />
        </div>
      </div>

      <DeleteAccount />
    </div>
  );
};

export default EditProfile;
