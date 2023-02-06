import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./colors.css";
import "./text.css";

import App from "./App";
import { Provider, useDispatch } from "react-redux";
import store from "./Redux/Store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
