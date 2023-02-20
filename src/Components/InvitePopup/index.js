import { useEffect, useState } from "react";
import { handleInvitePartner } from "../../Utils";

const InvitePopup = () => {
    const [inviteMode, setinviteMode] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [secretCode, setsecretCode] = useState(false);
  
    useEffect(() => {
      const item = window.sessionStorage.getItem("sc");
      if (item) {
        setsecretCode(item);
      }
    }, []);
    if (!inviteMode) {
      return (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center m-2 ">
          <div
            className="col-auto p-1 d-flex flex-column justify-content-center align-items-center pinkBorder rounded shadow-sm pointer"
            onClick={() => setinviteMode((prev) => !prev)}
          >
            <img src="/assets/icons/logo.svg" height="35" width="60" className="invert" />
            <span className="smFont text-center text-muted">Invite your friends!</span>
          </div>
        </div>
      );
    }
    return (
      <div className="col-12 d-flex flex-column justify-content-center align-items-center m-2 ">
        <img src="/assets/icons/logo.svg" height="50" width="60" className="invert" />
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <span className="smFont text-center">Send your friends a Whatsapp link with your code:</span>
          <input
            value={whatsappNumber}
            type="text"
            className="form-control p-1 smFont"
            placeholder="Enter your partners whatsapp number"
            onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^\d]/, ""))}
            pattern="[0-9]"
          />
        </div>
        <div className="col-12 d-flex flex-row justify-content-center align-items-center">
          <div
            onClick={() => handleInvitePartner(whatsappNumber, secretCode)}
            className="col-5  me-1 d-flex flex-row justify-content-center align-items-center bg-white btnShadow smFont rounded rounded-pill mt-2 p-1 pointer"
          >
            SEND INVITATION
          </div>
          <div
            className="col-5  d-flex flex-row justify-content-center align-items-center bg-white btnShadow smFont rounded rounded-pill mt-2 p-1 pointer "
            onClick={() => setinviteMode((prev) => !prev)}
          >
            CLOSE
          </div>
        </div>
      </div>
    );
  };

  export default InvitePopup;