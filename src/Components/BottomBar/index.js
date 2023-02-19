import "./BottomBar.css";
import { changeViewState } from "../../Utils";
import { useSelector } from "react-redux";

const BottomBar = () => {
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
  if (hasActiveGame) {
    return (
      <div className="col-12 d-flex flex-row justify-content-center align-items-center velevtBg bottomBarContainer">
        <div className="col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-12 col-12 d-flex flex-row justify-content-evenly align-items-center">
          <div onClick={() => changeViewState(8)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
            <img src="/assets/icons/home.svg" height="25" width="25" />
          </div>
          <div onClick={() => changeViewState(0)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
            <img src="/assets/icons/profile.svg" height="25" width="25" />
          </div>
        </div>
      </div>
    );
  }
  if (!hasActivePartner) {
    return (
      <div className="col-12 d-flex flex-row justify-content-center align-items-center velevtBg bottomBarContainer">
        <div className="col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-12 col-12 d-flex flex-row justify-content-evenly align-items-center">
          <div onClick={() => changeViewState(0)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
            <img src="/assets/icons/profile.svg" height="25" width="25" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="col-12 d-flex flex-row justify-content-center align-items-center velevtBg bottomBarContainer">
      <div className="col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-12 col-12 d-flex flex-row justify-content-evenly align-items-center">
        <div onClick={() => changeViewState(0)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
          <img src="/assets/icons/home.svg" height="25" width="25" />
        </div>
        <div onClick={() => changeViewState(0)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
          <img src="/assets/icons/profile.svg" height="25" width="25" />
        </div>
        <div onClick={() => changeViewState(9)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
          <img src="/assets/icons/favourites.svg" height="25" width="25" />
        </div>
        <div onClick={() => changeViewState(4)} className="col-auto d-flex flex-column justify-content-center align-items-center pointer ">
          <img src="/assets/icons/cards.svg" height="25" width="25" />
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
