import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCardRating } from "../../firebase";

const StarsRating = ({ userID, currentCard, isSpecificCard }) => {
  const interactedCards = useSelector((state) => state.user.interactedCards);
  const matchID = useSelector((state) => state.user.matchID);

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
    <>
      {isSpecificCard ? (
        <div className="col-auto d-flex flex-row justify-content-center align-items-center">
          {stars.map((el) => {
            return (
              <img
                src={el.like ? "/assets/icons/fullStar.svg" : "/assets/icons/emptyStar.svg"}
                height="25"
                width="25"
                // className="pointer"
                // onClick={() => setCardRating(matchID, interactedCards, el.id, cardID)}
              />
            );
          })}
        </div>
      ) : (
        <div className="col-auto d-flex flex-row justify-content-center align-items-center">
          {stars.map((el) => {
            return (
              <img
                src={el.like ? "/assets/icons/fullStar.svg" : "/assets/icons/emptyStar.svg"}
                height="25"
                width="25"
                className="pointer"
                onClick={() => setCardRating(matchID, interactedCards, el.id, cardID)}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default StarsRating;
