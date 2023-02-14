const GalleryCard = ({ imageUrl, category, handleCardClick }) => {
    return (
      <div
        onClick={() => handleCardClick(category)}
        className="animated col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-5 col-5 d-flex flex-column justify-content-center align-items-center cardBorder m-2 galleryCardContainer rounded-3 pointer"
      >
        <img src={imageUrl} className="cardImg m-1 col-11" />
        <span className="col-11 text-center mb-2 w-5 midFont align-self-center">{category}</span>
      </div>
    );
  };

  export default GalleryCard