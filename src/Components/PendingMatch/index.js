import { useSelector } from "react-redux";
import { changeViewState } from "../../Utils";

const PendingMatch = ({ hasPendingMatch }) => {
  const partnerID = useSelector((state) => state.user.partnerID);

  if (!hasPendingMatch) {
    return null;
  }
  return (
    <div
      className="pendingMatch d-flex flex-column justify-content-center align-items-center smFont text-center pinkBorder m-1 shadow-sm pointer rounded"
      onClick={() => changeViewState(2)}
    >
      <img src="/assets/icons/openCard.svg" height="30" width="30" className="" />
      You have pending match!
    </div>
  );
};
export default PendingMatch;
