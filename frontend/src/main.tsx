import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
