
const Register = () => {
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg animated">
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white ">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4 fs-3">Registration</span>
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <input
            type="text"
            className="form-control rounded-1 greyBtn"
            placeholder="CHOOSE USERNAME *"
          />
          <input
            type="text"
            className="form-control mt-3 rounded-1 greyBtn"
            placeholder="E-MAIL *"
          />
          <input
            type="text"
            className="form-control mt-3 rounded-1 greyBtn"
            placeholder="PASSWORD *"
          />
           <input
            type="text"
            className="form-control mt-3 rounded-1 greyBtn"
            placeholder="CONFIRM PASSWORD *"
          />

        </div>

      <div className='col-6 greyBtn btnShadow text-dark rounded-pill p-2 d-flex flex-column justify-content-center align-items-center mt-5'>
        REGISTER
      </div>
        <a href="/" className="text-white mt-5">
          User-Login
        </a>
      </div>
    </div>
  );
};
export default Register;
