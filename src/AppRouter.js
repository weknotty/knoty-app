import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import UserLogin from "./Components/UserLogin";
import Welcome from "./Components/Welcome";
import Register from "./Components/Register";
import App from "./Components/App";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<UserLogin />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/app" element={<App />} />
        <Route exact path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
