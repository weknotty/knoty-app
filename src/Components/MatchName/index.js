import { useSelector } from "react-redux";
import { changeViewState } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import "./MatchName.css";
const MatchName = ({ loading }) => {
  const hasActivePartner = useSelector((state) => state.user.hasActivePartner);
  const partnerImage = useSelector((state) => state.user.partnerImage);
  if (!partnerImage) {
    return null;
  }
  return (
    <div
      className="d-flex flex-column justify-content-center  align-items-center smFont text-center  m-1 pointer  matchNameContainer"
      onClick={() => changeViewState(5)}
    >
      {loading ? <ButtonLoader state={true} className="" /> : <img src={partnerImage} height="50" width="50" style={{objectFit:"cover"}} className="mt-1 " />}
    </div>
  );
};
export default MatchName;
