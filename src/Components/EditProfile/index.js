import { useEffect } from "react";
import {TransitionGroup} from "react-transition-group";
import { changeViewState } from "../../Utils";
import "./EditProfile.css";
const EditProfile = () => {
  useEffect(() => {
    // window.history.replaceState(null, "New Page Title", "/pathname/goes/here");
  }, []);
  return (
      <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-xxl-between justify-content-xl-between justify-content-lg-between justify-content-md-end justify-content-sm-end justify-content-end align-items-center align-self-end profileContainer">
        {/* profile image control */}
        <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative userProfileContainer">
          <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative">
            <img src="/assets/images/user.png" className="userProfileImage" />
            {/* <span className="indicatorLg" /> */}
            <span className="editProfileImage">
              <img src="/assets/icons/edit.svg" height="35" width="35" />
            </span>
          </div>
        </div>
        {/* about */}
        <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-3">
          <span className="col-12 text-start w-5">Little About Me</span>
          <input type="text" className="form-control greyBtn border-0 aboutMeText rounded-3" placeholder="Write something..." />
        </div>
        <div className="col-12 d-flex flex-row justify-content-center align-items-center mb-2">
          {/* gender */}

          <div className="col d-flex flex-column justify-content-center align-items-center">
            <span className="col-12 text-start w-5">Gender</span>
            <select className="form-select border-0  greyBtn">
              <option value="0">Choose</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non">Not-identified</option>
            </select>
          </div>
          {/* interests */}
          <div className="col d-flex flex-column justify-content-center align-items-center ms-2 ">
            <span className="col-12 text-start w-5">Interested-In:</span>
            <select className="form-select border-0  greyBtn">
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
            <input type="text" className="form-control  greyBtn border-0" placeholder="18" />
          </div>
          {/* country */}
          <div className="col d-flex flex-column justify-content-center align-items-center ms-2">
            <span className="col-12 text-start w-5">Country</span>
            <select className="form-select border-0  greyBtn">
              <option value="0">Choose</option>
              <option value="1">Israel</option>
            </select>
          </div>
        </div>
        <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-2">
          <div className="col-12 d-flex flex-column justify-content-center align-items-center">
            <span className="col-12 text-start w-5">My Sentence</span>
            <input type="text" className="form-control greyBtn border-0" placeholder="Write something..." />
          </div>
        </div>
        <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-3">
          <div
            className="col-8 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 me-2 midFont"
            onClick={() => changeViewState(1)}
          >
            CHOOSING A PARTNER
          </div>
          <div className="col d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 midFont">SAVE</div>
        </div>
        <div className="col-12 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill p-2 mt-3 text-muted mb-3 midFont">
          DELETE ACCOUNT
        </div>
      </div>
  );
};

export default EditProfile;
