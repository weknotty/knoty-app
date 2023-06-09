import { useEffect, useState } from "react";
import { v4 } from "uuid";
import Button from "../Button";
import "./KnotyTimer.css";
import { cancelGame, finishGame, getGameData } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import StarsRating from "../StarsRating";
import { changeViewState } from "../../Utils";
import { setDoneGame } from "../../Redux/Utils";
import ButtonLoader from "../ButtonLoader";
import GamePoints from "../../GamePoints";
const AcceptedStarted = ({ isAcceped, gameData, gameSignature }) => {
  const gameID = useSelector((state) => state.user.gameID);

  const [timer, setTimer] = useState("");
  const dispatch = useDispatch();
  const toHHMMSS = function (value) {
    var sec_num = value; // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  };

  const [submitDone, setSubmitDone] = useState(false);
  const [submitCancel, setSubmitCancel] = useState(false);

  useEffect(() => {
    let interval;
    if (gameData) {
      interval = setInterval(() => {
        const startTime = parseInt(gameData.startedIn);
        const duration = parseInt(gameData.duration) * 60 * 60;
        const now = new Date().getTime() / 1000;
        const maybe = startTime + duration;
        const untilNow = Math.round(maybe - now);
        if (untilNow <= 0) {
          clearInterval(interval);
          return;
        }
        const res = toHHMMSS(untilNow);
        setTimer(res);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameData]);


  useEffect(() => {
    if (submitDone) {
      console.log(gameID)
      finishGame(gameID, dispatch).then(() => {
        setSubmitDone(false);
      });
    }
    if (submitCancel) {
      cancelGame(gameID).then(() => {
        setSubmitCancel(false);
        changeViewState(1);
      });
    }
  }, [submitDone, submitCancel]);
  if (!isAcceped) {
    return null;
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-between align-items-center startedGameOverlay  ">
      <div className="blueOverlay" />
      <div className="col-12 d-flex flex-column justify-content-between align-items-center timerContent">
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <span className="fs-1">Go be Knoty</span>
          <img src="/assets/icons/sand.svg" className="" style={{opacity:"0"}} />
          <span className="timerValue">{timer}</span>
        </div>
      </div>
      <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ zIndex: "9999" }}>
        <div
          onClick={() => setSubmitDone(true)}
          className={`col-xxl-3 col-xl-3 col-lg-5 col-md-5 col-sm-6 col-6 d-flex flex-row justify-content-evenly align-items-center bg-white text-dark rounded-pill p-2 btnShadow mt-3 pointer`}
        >
          <span className="midFont" style={{ fontWeight: "500" }}>
            <ButtonLoader state={submitDone} text="I'M DONE!" />
          </span>
        </div>
        <div
          onClick={() => setSubmitCancel(true)}
          className={`col-xxl-3 col-xl-3 col-lg-5 col-md-5 col-sm-6 col-6 d-flex flex-row justify-content-evenly align-items-center bg-white text-dark rounded-pill p-2 btnShadow mt-3 pointer`}
        >
          <span className="midFont" style={{ fontWeight: "500" }}>
            <ButtonLoader state={submitCancel} text="CANCEL" />
          </span>
        </div>
      </div>
    </div>
  );
};

const KnotyTimer = () => {
  window.history.pushState({ appState: "0" }, "pushManageStore", "");
  const hasActiveGame = useSelector((state) => state.user.hasActiveGame);
  const doneGame = useSelector((state) => state.user.doneGame);
  const dispatch = useDispatch();

  const [isAcceped, setisAcceped] = useState(true);
  const gameSignature = useSelector((state) => state.user.gameSignature);
  const userID = useSelector((state) => state.user.userID);

  const [gameData, setGameData] = useState({});

  useEffect(() => {
    if (gameSignature) {
      getGameData(gameSignature).then((res) => {
        if (!res) {
          return;
        }
        setGameData(res);
      });
    }
  }, [gameSignature, hasActiveGame]);
  
  return (
    <div className="animated col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column flex-wrap m-auto justify-content-center align-items-center align-self-end profileContainer position-relative align-self-start">
      <span className="fs-3 mb-4">{gameData?.cardName}</span>
      <div className="col-auto m-auto d-flex flex-column justify-content-between align-items-center  m-2  rounded-3 specificCardContainer ">
        <img src="/assets/images/cardExample.png" className="cardImgDone m-1 col-11 mt-3 rounded" />
        <AcceptedStarted isAcceped={isAcceped} gameData={gameData} gameSignature={gameSignature} />
        <GamePoints gameData={gameData} userID={userID} />

        <div className="col-11 d-flex flex-row justify-content-between align-items-center mb-1"></div>
      </div>
    </div>
  );
};
export default KnotyTimer;
