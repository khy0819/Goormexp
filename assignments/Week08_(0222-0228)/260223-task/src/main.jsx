import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./App.css";

// vite.config.js의 base 설정값과 동일하게 맞춰줍니다.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/Goormexp/assignments/Week08_(0222-0228)/260223-task/dist/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
