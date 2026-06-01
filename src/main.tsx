import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "reactflow/dist/style.css";
import "./i18n"; // initialize i18next (Polish only)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
