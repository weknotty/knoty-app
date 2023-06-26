import Button from "../Components/Button";
import StarsRating from "../Components/StarsRating";
import { useEffect,useState } from "react";
import { changeViewState } from "../Utils";
import { useDispatch, useSelector } from "react-redux";
import { setDoneGame } from "../Redux/Utils";

const GamePoints = ({ gameData, userID }) => {
    const dispatch = useDispatch();
    const [done, setDone] = useState(false);
    const doneGame = useSelector((state) => state.user.doneGame);

    console.log(doneGame)
    useEffect(() => {
      if (done) {
        setDoneGame(dispatch,false)
        changeViewState(4);

      }
    }, [done]);
  
    if (!doneGame) {
      return null;
    }
    return (
      <div className="col-10 d-flex flex-column justify-content-start align-items-center startedGameOverlay flex-grow-1 m-auto shadow rounded rounded-3 animated">
        <div className="bg-white" />
        <div className="col-12 d-flex flex-column justify-content-between align-items-center timerContent bg-white h-100 rounded rounded-3">
          <div className="col-12 d-flex flex-row justify-content-start align-items-center position-absolute">
            <img src="/assets/icons/close.svg" height="18" width="18" className="m-2 pointer" onClick={() => setDone(true)} />
          </div>
          <div className="col-12 d-flex flex-column justify-content-center align-items-center mt-5 rounded">
            <span className="fs-1 mt-3">You Received</span>
            <div className="col-12 d-flex flex-row justify-content-center align-items-center">
              <img src="/assets/icons/fullStar.svg" className="me-2" />
              <span className="pointsEarned">{gameData.points}</span>
              <img src="/assets/icons/fullStar.svg" className="ms-2" />
            </div>
            <span className="fs-1">Points</span>
  
            <Button
              sizeClass={"col-xxl-3 col-xl-3 col-lg-5 col-md-5 col-sm-6 col-6 pointer"}
              handleClick={() => setDone(true)}
              text="O.K"
              key={"sdfnsdfdfuiif"}
            />
          </div>
          <div className="col-12 d-flex flex-column justify-content-center align-items-center m-auto">
            <span className="">My Card Rating</span>
            <StarsRating currentCard={{ id: gameData.cardID }}  userID={userID} key="sdfnsdjfnndfudf" />
          </div>
        </div>
      </div>
    );
  };
  export default GamePoints