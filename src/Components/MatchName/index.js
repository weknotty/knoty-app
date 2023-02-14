import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPendingMatches, getMatchBySignature, getUserProfile } from "../../firebase";
import { setPartnerID } from "../../Redux/Utils";
import { changeViewState } from "../../Utils";
import './MatchName.css';
const MatchName = () => {
    const dispatch = useDispatch()
  const matchSignature = useSelector((state) => state.user.matchSignature);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);

  const userID = useSelector((state) => state.user.userID);
  const [partnerImage, setpartnerImage] = useState("");

  const [user, setUser] = useState({});
  useEffect(() => {
    if(hasActivePartner){
      getMatchBySignature(userID, matchSignature).then((res) => {  
        if (res) {
          setpartnerImage(res.profileImageUrl)
          setUser(res);
          setPartnerID(dispatch,res.id)
        }
      });
    }

  }, [hasActivePartner, matchSignature,userID]);

  if (!hasActivePartner) {
    return null;
  }
  return (
    <div
      className="d-flex flex-column justify-content-center  align-items-center smFont text-center  m-1 pointer  matchNameContainer"
      onClick={() => changeViewState(5)}
    >
      <img src={partnerImage} height="50" width="50" className="mt-1 " />
    </div>
  );
};
export default MatchName;
