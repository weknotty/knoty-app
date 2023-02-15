import { useSelector } from "react-redux";
import { approveManual } from "../../firebase";
import { changeViewState } from "../../Utils";
import "./UserManual.css";
const UserManual = () => {
  window.history.pushState({ appState: "6" }, "pushManageStore", "");

  const userID = useSelector((state) => state.user.userID);

  const handleApprove = async () => {
     approveManual(userID).then(()=>{
      // changeViewState(7)

    })
  };
  return (
    <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column justify-content-start align-items-center profileContainer">
      <div className="col-12 d-flex flex-column justify-content-center align-items-center m-auto">
        <img src="/assets/icons/logo.svg" style={{filter:"invert(100%)"}} height="150"width="150"/>
        <div className="col-12 d-flex flex-row  justify-content-start align-items-center align-self-end  position-relative align-self-start">
          <div className="col d-flex flex-column justify-content-center align-items-center border-end">
            <img src="/assets/icons/arrow.svg" height="25" width="25" />
            <span className="text-center">Swipe left to skip to the next card</span>
          </div>
          <div className="col d-flex flex-column justify-content-center align-items-center">
            <img src="/assets/icons/arrow.svg" height="25" width="25" style={{ transform: "rotate(180deg)" }} />
            <span className="text-center">Swipe left to skip to the next card</span>
          </div>
        </div>
        <span className="text-center mt-5">Additional text for explanation. Additional text for explanation. Additional text for explanation.</span>
      </div>
      <div
        onClick={handleApprove}
        className="col-6 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-3 midFont pointer"
      >
        OK, I GOT IT
      </div>
    </div>
  );
};

export default UserManual;
