import { changeViewState } from "../../Utils";
import "./CardsSelect.css";

const GalleryCard = () => {
  return (
    <div onClick={()=>changeViewState(6)} className="animated col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-5 col-5 d-flex flex-column justify-content-center align-items-center cardBorder m-2 galleryCardContainer rounded-3">
      <img src="/assets/images/cardbg.png" className="cardImg m-1 col-11" />
      <span className="col-11 text-center mb-2 midFont align-self-center">Text with an explanation on the card</span>
    </div>
  );
};
const CardsSelect = () => {
  return (
    <div className="animated col-12 d-flex flex-column justify-content-start align-items-center profileContainer">
      <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-row flex-wrap m-auto justify-content-center align-items-center align-self-end  position-relative align-self-start">
        <div className="col-12 d-flex flex-row justify-content-center align-items-center position-relative">
          <img src="/assets/icons/question.svg" height="25" width="25" className="position-absolute start-0 ms-2" />
          <span className="fs-3 mt-5 mb-5 align-self-end">Category selection</span>
        </div>

        {[1, 2, 3, 4, 5].map(() => {
          return <GalleryCard />;
        })}
      </div>
    </div>
  );
};

export default CardsSelect;
