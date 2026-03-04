import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* basename은 vite.config.js의 base와 일치시켜야 합니다 */}
    <BrowserRouter>
      {" "}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
