import "./ChoosePartner.css";
const ChoosePartnerPopup = ({setShowPopup}) => {
  return (
    <div className="col-10 d-flex flex-column justify-content-center align-items-center greyBtn btnShadow addConnectionPopup" id="addConnectionPopup">
      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
        <span className="col-10">Enter your connection secret</span>
      </div>
      <div className="col-10 d-flex flex-column justify-content-center align-items-center">
        <input type="text" className="form-control" placeholder="Enter code" />
      </div>
      <div className="col-10 d-flex flex-row justify-content-center align-items-center">
        <div className="col me-1 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill mt-2 p-1 mb-3 midFont pointer">
          SUBMIT
        </div>
        <div className="col d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill mt-2 p-1 mb-3 midFont pointer " onClick={() => setShowPopup((prev) => !prev)}>CLOSE</div>
      </div>
    </div>
  );
};

export default ChoosePartnerPopup;
