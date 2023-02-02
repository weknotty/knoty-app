
const UserLogin = () => {
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center imgBg ">
      <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white animated">
        <img src="/assets/icons/logo.svg" height="200" width="200" />
        <span className="col-10 mb-4 fs-3">User Login</span>
        <div className="col-10 d-flex flex-column justify-content-center align-items-center">
          <input
            type="text"
            className="form-control rounded-1 greyBtn"
            placeholder="USERNAME *"
          />
          <input
            type="text"
            className="form-control mt-3 rounded-1 greyBtn"
            placeholder="PASSWORD *"
          />
          <a href="/forgot" className="text-white align-self-start mt-3">
            Forgot Password
          </a>
        </div>
      <div className='col-10 d-flex flex-row justify-content-center align-items-center mt-5'>
        <input type="checkbox" className="form-check-input p-2 align-self-center"/>
        <span className="mt-1 ms-2">Remember Me</span>
      </div>
      <a href="/app" className='col-6 greyBtn btnShadow text-dark rounded-pill p-2 d-flex flex-column justify-content-center align-items-center mt-5'>
        APPROVAL
      </a>
        <a href="/register" className="text-white mt-5">
          REGISTRATION
        </a>
      </div>
    </div>
  );
};
export default UserLogin;
