import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavouritesCards } from "../../firebase";
import GalleryCard from "../GalleryCard";

const Favourites = () => {
  window.history.pushState({ appState: "4" }, "pushManageStore", "");

  const [localCards, setCards] = useState([]);
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.user.interactedCards);
  console.log(cards)
  useEffect(() => {
    getFavouritesCards(cards).then((res) => {
      setCards(res)
      console.log(res)
    });
  }, []);

  // const handleCardClick = async (category) => {
  //   console.log(category);
  //   const cards = await getCategoriesByType(category);
  //   setCardsList(dispatch, cards);
  //   setCardsCategory(dispatch, category);
  //   changeViewState(7);
  //   return;
  // };
  return (
    <div className="animated col-12 d-flex flex-column justify-content-start align-items-center profileContainer ">
      <div className=" h-100 col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-row flex-wrap  justify-content-center  align-items-center   position-relative ">
        <div className="col-12 d-flex flex-row justify-content-center align-items-center position-relative">
          <img src="/assets/icons/question.svg" height="25" width="25" className="position-absolute start-0 ms-2" />
          <span className="fs-3  align-self-end">Your Favourites</span>
        </div>

        {localCards == false
          ? "You done have any favourites card yet."
          : localCards.map((el) => {
              return <GalleryCard category={el.name} handleCardClick={() => {}} imageUrl={el.imageUrl} />;
            })}
      </div>
    </div>
  );
};
export default Favourites;
