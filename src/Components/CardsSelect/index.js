import { changeViewState } from "../../Utils";
import { v4 } from "uuid";
import "./CardsSelect.css";
import { useEffect, useState } from "react";
import { setCardsCategory, setCardsList } from "../../Redux/Utils";
import { useDispatch } from "react-redux";
import { getCategories, getCategoriesByType, setCards, setSomething } from "../../firebase";
const GalleryCard = ({ imageUrl, category, handleCardClick }) => {
  return (
    <div
      onClick={() => handleCardClick(category)}
      className="animated col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-5 col-5 d-flex flex-column justify-content-center align-items-center cardBorder m-2 galleryCardContainer rounded-3"
    >
      <img src={imageUrl} className="cardImg m-1 col-11" />
      <span className="col-11 text-center mb-2 w-5 midFont align-self-center">{category}</span>
    </div>
  );
};
const CardsSelect = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, []);

  const handleCardClick = async (category) => {
    console.log(category);
    const cards = await getCategoriesByType(category);
    console.log(cards)
    setCardsList(dispatch, cards);
    setCardsCategory(dispatch, category);
    changeViewState(7);
    return;
  };

  return (
    <div className="animated col-12 d-flex flex-column justify-content-start align-items-center profileContainer">
      <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-row flex-wrap m-auto justify-content-center align-items-center align-self-end  position-relative align-self-start">
        <div className="col-12 d-flex flex-row justify-content-center align-items-center position-relative">
          <img src="/assets/icons/question.svg" height="25" width="25" className="position-absolute start-0 ms-2" />
          <span className="fs-3 mt-5 mb-5 align-self-end">Category selection</span>
        </div>

        {categories.map((el) => {
          return <GalleryCard imageUrl={el.imageUrl} category={el.category} handleCardClick={handleCardClick} />;
        })}
      </div>
    </div>
  );
};

export default CardsSelect;
