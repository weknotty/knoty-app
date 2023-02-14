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

      <Toast />
      <Manager/>
      <AppRouter />
    </div>
  );
}

export default App;
