import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createNewMatch, findMatchByCode } from "../../firebase";
import { changeViewState, setToast } from "../../Utils";
import "./ContactingPartner.css";
const ContactingPartner = () => {
  const currentUser = useSelector((state) => state.user);
  const partnerImage = useSelector((state) => state.user.partnerImage);
  const secretCode = useSelector((state) => state.user.secretCode);

  useEffect(() => {}, []);
  const onApproveMatch = () => {
    findMatchByCode(secretCode,currentUser.userID).then(async (res) => {
      await createNewMatch(currentUser.userID, res.partner.id, res.user, res.partner).catch(err=>console.log(err))
      setToast({state:"success",text:"Matched successfuly!"})
      console.log(res)
    });
    
    return
  };
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end ">
      <div className="col-11 d-flex flex-row justify-content-center align-items-center profileContainer">
        <img src={currentUser.profileImageUrl} className="profileImageMid" />
        <img src="/assets/icons/waitingForPartner.svg" className="col" height="15" />
        <img src={partnerImage} className="profileImageMid" />
      </div>
      <div
        onClick={onApproveMatch}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
      >
        OK, THAT'S IT
      </div>
      <div
        onClick={() => changeViewState(0)}
        className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mb-1 midFont pointer"
      >
        CANCEL
      </div>
    </div>
  );
};

export default ContactingPartner;
