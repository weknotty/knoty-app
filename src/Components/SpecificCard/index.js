import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCardLiked, setCardRating } from "../../firebase";
import { changeViewState } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import "./SpecificCard.css";
const Rating = ({ userID, cardID, setisAcceped, likeCard }) => {
  const interactedCards = useSelector((state) => state.user.interactedCards);

  const [stars, setStars] = useState([
    { id: 1, like: false },
    { id: 2, like: false },
    { id: 3, like: false },
    { id: 4, like: false },
    { id: 5, like: false },
  ]);
  const [isLiked, setIsLiked] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    console.log(interactedCards);
    const initStart = [1, 2, 3, 4, 5];
    const item = interactedCards.filter((el) => el.card == cardID);
    if(item == false){
      return
    }
    console.log("item", item[0].rating);

    const rating = item[0].rating;
    const starsCopy = stars.map((el) => {
      if (el.id <= rating) {
        return { id: el.id, like: true };
      }
        return { id: el.id, like: false };
    });

    setStars(starsCopy);
    console.log("starsCopy",starsCopy)
    // setIsLiked(item.isLiked)
  }, [cardID,interactedCards]);

  return (
    <div className="col-11 d-flex flex-row justify-content-between align-items-center mb-1">
      <div className="col-auto d-flex flex-row justify-content-center align-items-center">
        {stars.map((el) => {
          return (
            <img
              src={el.like ? "/assets/icons/fullStar.svg" : "/assets/icons/emptyStar.svg"}
              height="25"
              width="25"
              className="pointer"
              onClick={() => setCardRating(userID, interactedCards, el.id, cardID)}
            />
          );
        })}
      </div>
      <div className="col-auto d-flex flex-row justify-content-center align-items-center">
        <img
          src={likeCard ? "/assets/icons/doneCard.svg" : "/assets/icons/openCard.svg"}
          className="pointer"
          onClick={() => setisAcceped((prev) => !prev)}
          height="25"
          width="25"
        />
      </div>
    </div>
  );
};
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
const Card = ({ userID, currentCard, likeCard }) => {
  const [isAcceped, setisAcceped] = useState(false);
  if (!currentCard.hasOwnProperty("imageUrl")) {
    return <ButtonLoader state={true} />;
  }
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
      <span className="fs-3 mb-4">{currentCard.name}</span>

      <div className="col-auto m-auto d-flex flex-column justify-content-between align-items-center cardBorder m-2  rounded-3 specificCardContainer animated">
        <img src={currentCard.imageUrl} className="cardImg m-1 col-11 mt-3 rounded" />
        <AccepedMission isAcceped={isAcceped} />
        <span className=" text-center mb-2 cardTextFont align-self-center">{currentCard.innerText}</span>
        <Rating cardID={currentCard.id} setisAcceped={setisAcceped} userID={userID} key={currentCard.id} />
      </div>
    </div>
  );
};
const SpecificCard = () => {
  const userID = useSelector((state) => state.user.userID);
  const interactedCards = useSelector((state) => state.user.interactedCards);
  const cardsList = useSelector((state) => state.user.cardsList);

  const [currentCard, setCurrentCard] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [likeCard, setLikeCard] = useState(false);
  const [nextCard, setNextCard] = useState(false);

  useEffect(() => {
    const card = {};

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
    console.log("new card", cardsList[currentCardIndex]);
    setCurrentCard(cardsList[currentCardIndex]);
    console.log("cardsList", cardsList);
  }, [currentCardIndex]);
  return (
    <div className="animated col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column flex-wrap m-auto justify-content-center align-items-center align-self-end profileContainer position-relative align-self-start">
      <span className="border col text-center pointer" onClick={()=>setCardLiked(userID,interactedCards,currentCard.id)}>approve</span>
      <span className="border col text-center pointer" onClick={() => setNextCard(true)}>
        next
      </span>
      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
        <Card userID={userID} currentCard={currentCard} likeCard={likeCard} />
      </div>
    </div>
  );
};

export default SpecificCard;
