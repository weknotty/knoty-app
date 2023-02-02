import "./UserProfile.css";

const UserProfile = () => {
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end profileContainer">
      {/* profile image control */}
      <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative userProfileContainer">
        <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative">
          <img src="/assets/images/user.png" className="userProfileImage" />
          <span className="indicatorLg position-absolute" />
        </div>
        <span className="">AMIT</span>
        <span className="w-5">25</span>
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center">
        <span className="col-12 text-start w-5">Little About Me</span>
        <span className="col-12 text-start midFont">
          Text about myself. Text about myself. Text about myself. Text about myself. Text about myself. Text about myself.
        </span>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-3">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">Gender</span>
          <span className="col-12 text-start midFont">Male</span>
        </div>
        <div className="col d-flex flex-column justify-content-center align-items-center">
          <span className="col-12 text-start w-5">interested in:</span>
          <span className="col-12 text-start midFont">Women</span>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
        <span className="col-12 text-start w-5">Country</span>
        <span className="col-12 text-start">Israel</span>
      </div>
      <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
        <span className="col-12 text-start w-5">His sentence</span>
        <span className="col-12 text-start">Text. Text. Text. Text.</span>
      </div>
      <div className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill   p-2 midFont pointer mt-2">
        <span className="">SWITCH</span>
        <img src="/assets/icons/switch.svg" height="18" width="18" />
      </div>
      <div className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-3 midFont pointer">
        END CONNECTION
      </div>
    </div>
  );
};

export default UserProfile;
