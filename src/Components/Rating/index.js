import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCardRating } from "../../firebase";
import StarsRating from "../StarsRating";

const Rating = ({ userID, currentCard, setisAcceped, likeCard }) => {
  const interactedCards = useSelector((state) => state.user.interactedCards);
  const cardID = currentCard.id;
  const [stars, setStars] = useState([
    { id: 1, like: false },
    { id: 2, like: false },
    { id: 3, like: false },
    { id: 4, like: false },
    { id: 5, like: false },
  ]);

  useEffect(() => {
    const item = interactedCards.filter((el) => el.card == cardID);
    if (item == false) {
      return;
    }
    const rating = item[0].rating;
    const starsCopy = stars.map((el) => {
      if (el.id <= rating) {
        return { id: el.id, like: true };
      }
      return { id: el.id, like: false };
    });
    setStars(starsCopy);
  }, [cardID, interactedCards]);

  return (
    <div className="col-11 d-flex flex-row justify-content-between align-items-center mb-1">
      <StarsRating currentCard={currentCard} userID={userID} key="dsfjsdmfisofmidfsmdf"/>
      <div className="col-auto d-flex flex-row justify-content-center align-items-center">
        <img
          src={likeCard ? "/assets/icons/doneCard.svg" : "/assets/icons/openCard.svg"}
          className=""
          height="25"
          width="25"
        />
        
      </div>
      
    </div>
  );
};

export default Rating;