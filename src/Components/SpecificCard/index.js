import { useState } from "react";
import { changeViewState } from "../../Utils";
import "./SpecificCard.css";

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
const Card = () => {
  const [isAcceped, setisAcceped] = useState(false);

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
      <span className="fs-3 mb-4">Name of the card</span>

      <div className="col-auto m-auto d-flex flex-column justify-content-between align-items-center cardBorder m-2  rounded-3 specificCardContainer animated">
        <img src="/assets/images/cardExample.png" className="cardImg m-1 col-11 mt-3 rounded" />
        <AccepedMission isAcceped={isAcceped} />
        <span className=" text-center mb-2 cardTextFont align-self-center">
          Text with an explanation on the card explanation on the cardexplanation on the card explanation on the card
        </span>
        <div className="col-11 d-flex flex-row justify-content-between align-items-center mb-1">
          <div className="col-auto d-flex flex-row justify-content-center align-items-center">
            {[1, 2, 3, 4, 5].map(() => {
              return <img src="/assets/icons/fullStar.svg" height="25" width="25" className="" />;
            })}
          </div>
          <div className="col-auto d-flex flex-row justify-content-center align-items-center">
            <img src="/assets/icons/openCard.svg" onClick={() => setisAcceped((prev) => !prev)} height="25" width="25" />
          </div>
        </div>
      </div>
    </div>
  );
};
const SpecificCard = () => {
  return (
    <div className="animated col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column flex-wrap m-auto justify-content-center align-items-center align-self-end profileContainer position-relative align-self-start">
      <span className="border col text-center pointer">approve</span>
      <span className="border col text-center pointer">next</span>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
        <Card />
      </div>
    </div>
  );
};

export default SpecificCard;
