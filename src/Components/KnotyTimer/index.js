import { useEffect, useState } from "react";
import { v4 } from "uuid";
import Button from "../Button";
import "./KnotyTimer.css";
import { TransitionGroup } from "react-transition-group";
import { cancelGame, getGameData } from "../../firebase";
import { useSelector } from "react-redux";
const AcceptedStarted = ({ isAcceped, gameData, gameSignature }) => {
  if (!isAcceped) {
    return null;
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-between align-items-center startedGameOverlay  ">
      <div className="blueOverlay" />
      <div className="col-12 d-flex flex-column justify-content-between align-items-center timerContent">
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <span className="fs-1">Go be Knoty</span>
          <img src="/assets/icons/sand.svg" className="" />
          <span className="timerValue">{gameData.duration}:00</span>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{zIndex:"9999"}}>
        <div
          className={`col-xxl-3 col-xl-3 col-lg-5 col-md-5 col-sm-6 col-6 d-flex flex-row justify-content-evenly align-items-center bg-white text-dark rounded-pill p-2 btnShadow mt-3 pointer`}
          
        >
          <span className="midFont" style={{ fontWeight: "500" }}>
            I'M DONE!
          </span>
        </div>
        <div
          onClick={() => cancelGame(gameSignature)}
          className={`col-xxl-3 col-xl-3 col-lg-5 col-md-5 col-sm-6 col-6 d-flex flex-row justify-content-evenly align-items-center bg-white text-dark rounded-pill p-2 btnShadow mt-3 pointer`}
        >
          <span className="midFont" style={{ fontWeight: "500" }}>
            CANCEL
          </span>
        </div>
      </div>
    </div>
  );
};
const GamePoints = ({ isOk }) => {
  if (!isOk) {
    return null;
  }
  return (
    <div className="col-10 d-flex flex-column justify-content-start align-items-center startedGameOverlay m-auto shadow rounded rounded-3 animated">
      <div className="bg-white" />
      <div className="col-12 d-flex flex-column justify-content-between align-items-center timerContent bg-white h-100 rounded rounded-3">
        <div className="col-12 d-flex flex-row justify-content-start align-items-center position-absolute">
          <img src="/assets/icons/close.svg" height="18" width="18" className="m-2 pointer" />
        </div>
        <div className="col-12 d-flex flex-column justify-content-center align-items-center mt-5 rounded">
          <span className="fs-1 mt-3">You Received</span>
          <div className="col-12 d-flex flex-row justify-content-center align-items-center">
            <img src="/assets/icons/fullStar.svg" className="me-2" />
            <span className="pointsEarned">50</span>
            <img src="/assets/icons/fullStar.svg" className="ms-2" />
          </div>
          <span className="fs-1">Points</span>

          <Button sizeClass={"col-xxl-3 col-xl-3 col-lg-5 col-md-5 col-sm-6 col-6"} text="O.K" key={v4()} />
        </div>
        <div className="col-12 d-flex flex-column justify-content-center align-items-center m-auto">
          <div className="col-8 d-flex flex-row justify-content-center align-items-center">
            {[1, 2, 3, 4, 5].map((el) => {
              return <img src="/assets/icons/fullStar.svg" height="20" width="20" className="" />;
            })}
          </div>
          <span className="">My Card Rating</span>
        </div>
      </div>
    </div>
  );
};
const KnotyTimer = () => {
  const [isAcceped, setisAcceped] = useState(true);
  const gameSignature = useSelector((state) => state.user.gameSignature);
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    getGameData(gameSignature).then((res) => {
      if (!res) {
        return;
      }
      setGameData(res);
      console.log(res);
    });
  }, []);
  return (
    <div className="animated col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column flex-wrap m-auto justify-content-center align-items-center align-self-end profileContainer position-relative align-self-start">
      <span className="fs-3 mb-4">Name of the card</span>
      <div className="col-auto m-auto d-flex flex-column justify-content-between align-items-center  m-2  rounded-3 specificCardContainer ">
        <img src="/assets/images/cardExample.png" className="cardImgDone m-1 col-11 mt-3 rounded" />
        <AcceptedStarted isAcceped={isAcceped} gameData={gameData} gameSignature={gameSignature} />
        {/* <GamePoints isOk={isAcceped} /> */}

        <div className="col-11 d-flex flex-row justify-content-between align-items-center mb-1"></div>
      </div>
    </div>
  );
};
export default KnotyTimer;
