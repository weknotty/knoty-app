import {useSelector } from "react-redux";
import { changeViewState } from "../../Utils";
import "./MatchName.css";
const MatchName = () => {
  const partnerImage = useSelector((state) => state.user.partnerImage);
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);

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
