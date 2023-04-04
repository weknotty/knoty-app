import "./TopBar.css";
import { useSelector } from "react-redux";
import { changeViewState } from "../../Utils";

const TopBar = () => {
  const partnerImage = useSelector((state) => state.user.partnerImage) || "/assets/images/cardbg.png";
  const username = useSelector((state) => state.user.username) || "";
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const partnerName = useSelector((state) => state.user.partnerName);

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg">
    
      <div className="col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-row justify-content-center align-items-center ">
        <div className="col d-flex flex-column justify-content-between align-items-center">
          <div className="position-relative col d-flex flex-column justify-content-center align-items-center pointer" onClick={() => changeViewState(5)}>
            {partnerImage && hasActivePartner ? <img src={partnerImage} className="profileSm" /> : <span className="bg-light rounded rounded-circle profileSm"></span>}
            <span className="position-absolute"></span>
          </div>
          
          <span className="smFont w-3 text-white">{partnerName}</span>
        </div>
        <div className="col-6 d-flex flex-column justify-content-center align-items-center" onClick={() => (hasActivePartner ? changeViewState(4) : null)}>
          <img src="/assets/icons/logo.svg" height="75" width="100"/>
        </div>
        <div className="col d-flex flex-column justify-content-center align-items-center text-white"  style={{opacity:"0.5"}}>
          <img src="/assets/icons/offer.svg" height="30" width="30" />
          <span className="text-center smFont">Today's offer</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
