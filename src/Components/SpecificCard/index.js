import { createRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCardLiked, setCardRating, setNewSwipe, setSwipesEvent } from "../../firebase";
import ButtonLoader from "../ButtonLoader";
import "./SpecificCard.css";
import Rating from "../Rating";
import AccepedMission from "../AcceptMission";
import { useSwipeable } from "react-swipeable";

const Card = ({ userID, currentCard, setNextCard }) => {
  const [isAcceped, setisAcceped] = useState(false);
  if (!currentCard || !currentCard.hasOwnProperty("imageUrl")) {
    return <ButtonLoader state={true} />;
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center m-auto specificCard">
      <span className="fs-3 mb-4">{currentCard.name}</span>

      <div className=" col-auto m-auto d-flex flex-column justify-content-between align-items-center cardBorder m-2  rounded-3 specificCardContainer animated">
        <img src={currentCard.imageUrl} className="cardImg m-1 col-11 mt-3 rounded" onClick={() => setNextCard(true)} />
        <AccepedMission isAcceped={isAcceped} />
        <span className=" text-center mb-2 cardTextFont align-self-center">{currentCard.innerText}</span>
        <Rating currentCard={currentCard} setisAcceped={setisAcceped} userID={userID} key={currentCard.id} />
      </div>
    </div>
  );
};


const SpecificCard = () => {
  window.history.pushState({ appState: "4" }, "pushManageStore", "");
  const userID = useSelector((state) => state.user.userID);
  const interactedCards = useSelector((state) => state.user.interactedCards);
  const cardsList = useSelector((state) => state.user.cardsList);
  const cardsCategory = useSelector((state) => state.user.cardsCategory);
  const [currentCard, setCurrentCard] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [nextCard, setNextCard] = useState(false);
  const [swipedRight, setSwipedRight] = useState(false);
  const [swipedLeft, setSwipedLeft] = useState(false);
  
  const newspaperLeft = [{ transform: " translateX(-300px)" }];
  const newspaperRight = [{ transform: " translateX(300px)" }];

  const newspaperTiming = {
    duration: 250,
    iterations: 1,
  };

  const swipeHanlder = useSwipeable({
    onSwiped: (e) => {
      const direction = e.dir;
      if (direction === "Right") {
        setSwipedRight(true);
        return;
      }
      if (direction === "Left") {
        setSwipedLeft(true);
        return;
      }
    },
    trackMouse: true,
  });

  useEffect(() => {
    if (nextCard) {
      if (currentCardIndex < cardsList.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
        setNextCard(false);
        return;
      }
      if (currentCardIndex == cardsList.length - 1) {
        setNextCard(false);
        setCurrentCardIndex(0);
      }
    }
  }, [nextCard]);

  useEffect(() => {
    setCurrentCard(cardsList[currentCardIndex]);
  }, [currentCardIndex]);

  useEffect(() => {
    if (swipedLeft || swipedRight) {
      setSwipesEvent({ userID, cardID: currentCard.id });
    }
    const ref = { current: document.getElementById("containerus") };
    if (swipedRight) {
      if (ref.current) {
        ref.current.animate(newspaperRight, newspaperTiming);
      }
      setCardLiked(userID, interactedCards, currentCard, cardsCategory, true)
        .catch((err) => console.log(err))
        .then(() => {
          setNextCard(true);
          setSwipedRight(false);
          return;
        });
      return;
    }
    if (swipedLeft) {

      if (ref.current) {
        ref.current.animate(newspaperLeft, newspaperTiming);
      }
      setCardLiked(userID, interactedCards, currentCard, cardsCategory, false)
        .catch((err) => console.log(err))
        .then(() => {
          setNextCard(true);
          setSwipedLeft(false);
          return;
        });

      return;
    }
  }, [swipedLeft, swipedRight]);

  return (
    <div className="animated col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column justify-content-center align-items-center profileContainer position-relative">
      <div className="col-12 d-flex flex-row justify-content-center align-items-center" id="containerus" {...swipeHanlder}>
        <Card userID={userID} currentCard={currentCard} setNextCard={setNextCard} />
      </div>
    </div>
  );
};

export default SpecificCard;
