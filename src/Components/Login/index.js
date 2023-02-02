
const Login = () => {
  return (
    <div className='col-12 d-flex flex-column justify-content-center align-items-center imgBg'>
    <div className="col-xxl-3 col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 m-auto d-flex flex-column justify-content-center align-items-center fullHeight text-center text-white animated">
      <img src="/assets/icons/logo.svg" height="200" width="200" />
      <span className="col-10 mb-4">
        text text text text text text text text text text text text text text
        text text text text text text text text text text text text text text
        text text text text text text text
      </span>
      <div className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3">
        <span className="col-8 text-start w-4">LOG IN WITH GOOGLE</span>
        <img src="/assets/icons/google.svg" height="30" width="30" />
      </div>
      <div className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3">
        <span className="col-8 text-start w-4">LOG IN WITH FACEBOOK</span>
        <img src="/assets/icons/facebook.svg" height="30" width="30" />
      </div>
      <a href="/login" className="col-10 d-flex flex-row justify-content-evenly align-items-center greyBtn text-dark rounded-pill p-2 btnShadow mt-3"style={{textDecoration:"unset"}}>
        <span className="col-8 text-start w-4" >USER LOGIN</span>
        <img src="/assets/icons/login.svg" height="25" width="25" />
      </a>

      <a href="/register" className="text-white mt-5">REGISTRATION</a>
    </div>
    </div>
  );
};
export default Login;
