import "./App.css";
import AppRouter from "./AppRouter";
import Toast from "./Components/Toast";
import { useDispatch, useSelector } from "react-redux";

import Manager from "./Manager";
import { setHasPendingMatch } from "./Redux/Utils";

function App() {
  const dispatch = useDispatch();
  const hasPendingMatch = useSelector((state) => state.user.hasPendingMatch);

  return (
    <div className="App position-relative">
      <div className='col-12 d-flex flex-row justify-content-center align-items-center'>
        <span onClick={()=>setHasPendingMatch(dispatch,!hasPendingMatch)}>pending match</span>
      </div>
      <Toast />
      <Manager/>
      <AppRouter />
    </div>
  );
}

export default App;
