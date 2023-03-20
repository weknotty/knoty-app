import { useEffect, useState } from "react";
import { handleInvitePartner, setToast } from "../../Utils";
import countryCodes from "../../countryCodes.json";

const InvitePopup = () => {
  const [inviteMode, setinviteMode] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [secretCode, setsecretCode] = useState(false);
  const [countries, setcountries] = useState([]);
  const [countryCode, setcountryCode] = useState("");
  const [inviteNow, setInviteNow] = useState(false);

  useEffect(() => {
    const res = Object.values(countryCodes);
    setcountries(res);
  }, []);
  useEffect(() => {
    const item = window.sessionStorage.getItem("sc");
    if (item) {
      setsecretCode(item);
    }
  }, []);
  useEffect(() => {
    if (inviteNow) {
      console.log("well");
      if (!countryCode) {
        setInviteNow(false);
        setToast({ state: "warning", text: "Please select country code." });
        return;
      }
      const num = countryCode + whatsappNumber;
      handleInvitePartner(num, secretCode);

      setInviteNow(false);
    }
  }, [inviteNow]);

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
        <div className="col-12 d-flex flex-row justify-content-center align-items-center">
          <select className="form-select p-1 smFont" style={{ width: "150px" }} onChange={(e) => setcountryCode(`+${e.target.value}`)}>
            <option value="">Choose</option>
            {countries.map((el) => {
              return (
                <option className="p-1" value={el.code}>
                  {el.name}-{el.code}
                </option>
              );
            })}
          </select>
          <input
            value={whatsappNumber}
            type="text"
            className="form-control p-1 smFont"
            placeholder="Enter your partners whatsapp number"
            onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^\d]/, ""))}
            pattern="[0-9]"
          />
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
        <div
          onClick={() => setInviteNow(true)}
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
