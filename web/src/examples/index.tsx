import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { store } from "../store";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { SocketProvider } from "../components/Socket";
import { WS } from "../components/WSComponent";

const el = document.getElementById("root");
if (el != null) {
  const root = createRoot(el);
  root.render(
    <Provider store={store}>
      <SocketProvider url="http://localhost:3000">
        <WS />
        <Router>
          <App />
        </Router>
      </SocketProvider>
    </Provider>
  );
} else {
  console.error("#root not found");
}
