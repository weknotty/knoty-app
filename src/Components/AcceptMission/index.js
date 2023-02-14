import { changeViewState } from "../../Utils";

const AccepedMission = ({ isAcceped }) => {
  if (!isAcceped) {
    return null;
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center accepedMissionOverlay btnShadow" onClick={() => changeViewState(8)}>
      <img src="/assets/icons/simpleLogo.svg" />
      <span className="fs-3 text-white">Mission Accepted!</span>
    </div>
  );
};
export default AccepedMission;
