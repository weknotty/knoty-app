import { changeViewState } from "../../Utils";
import { v4 } from "uuid";
import "./CardsSelect.css";
import { useEffect, useState } from "react";
import { setCardsCategory, setCardsList } from "../../Redux/Utils";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getCategoriesByType, setCards, setSomething } from "../../firebase";
import GalleryCard from "../GalleryCard";
import UserManual from "../UserManual";

const CardsSelect = () => {
  const [categories, setCategories] = useState([]);
  const [approvedManual, setapprovedManual] = useState(true);
  const acceptedManual = useSelector((state) => state.user.acceptedManual);
  const dispatch = useDispatch();
  useEffect(() => {
    setapprovedManual(acceptedManual);
  }, [acceptedManual]);
  useEffect(() => {
    getCategories().then((res) => {
      console.log(res);
      setCategories(res);
    });
  }, []);

  const handleCardClick = async (category) => {
    console.log(category);
    const cards = await getCategoriesByType(category);
    setCardsList(dispatch, cards);
    setCardsCategory(dispatch, category);
    changeViewState(7);
    return;
  };
  if (!approvedManual) {
    return <UserManual />;
  }
  return (
    <div className="animated col-12 d-flex flex-column justify-content-start align-items-center profileContainer animated">
      <div className="h-100 col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-row flex-wrap justify-content-center align-items-center   position-relative">
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
