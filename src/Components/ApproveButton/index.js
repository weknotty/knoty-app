import { cancelMatch } from "../../firebase";
import { changeViewState } from "../../Utils";
import ButtonLoader from "../ButtonLoader";

 const ApproveButton = ({ status, onApproveMatch, submit, userID, matchSignature, partnerID,hasActiveGame,setApproveMatch }) => {
    if (submit) {
      return <ButtonLoader state={true} />;
    }
    if (!status) {
      return (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <div
            onClick={()=>setApproveMatch(true)}
            className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
            disabled={true}
          >
            APPROVE
          </div>
  
          <div
            onClick={() => changeViewState(1)}
            className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
          >
            CANCEL REQUEST
          </div>
        </div>
      );
    }
    if (status === "approved") {
      return (
        <div
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
          onClick={() => cancelMatch(userID, "pending", "rejected", matchSignature, partnerID,hasActiveGame)}
        >
          Cancel Request
        </div>
      );
    }
    if (status === "pending") {
      return (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <div
            onClick={()=>setApproveMatch(true)}
            className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
            disabled={true}
          >
            APPROVE
          </div>
  
          <div
            onClick={() => cancelMatch(userID, "pending", "rejected", matchSignature, partnerID,hasActiveGame)}
            className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
          >
            CANCEL REQUEST
          </div>
        </div>
      );
    }
    if (status === "rejected") {
      return (
        <div
          className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
          disabled={true}
        >
          GO BACK
        </div>
      );
    }
  };
  export default ApproveButton