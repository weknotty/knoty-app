import "./App.css";
import AppRouter from "./AppRouter";
import Toast from "./Components/Toast";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "./firebase";
import { setIsUserActive } from "./Redux/Utils";
import Manager from "./Manager";

function App() {
  const dispatch = useDispatch();

  return (
    <div className="App position-relative">
      <Toast />
      <Manager/>
      <AppRouter />
    </div>
  );
}

export default App;
