import { useState } from "react";
import "./Feedback.css";
const Feedback = () => {
  return (
    <div className="animated col-xxl-3 col-xl-5 col-lg-6 col-md-6 col-sm-11 col-11 d-flex flex-column m-auto justify-content-start justify-content-start align-items-center align-self-end profileContainer position-relative">
      <span className="fs-3">Feedback</span>
      <span className="text-center">You have had 7 logins to Knoty. Please give us your feedback </span>
      <input type="text" placeholder="Your message" className="form-control border-0 greyBtn feedbackInput"/>
      <div className="col-10 d-flex flex-row justify-content-center align-items-center bg-white btnShadow rounded rounded-pill  mt-3 p-2 mt-5 midFont pointer">
        SUBMIT
      </div>
    </div>
  );
};

export default Feedback;
