import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Login from "./components/Login.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    {sessionStorage.getItem('access_token') ?<App /> : <Login></Login>} 
  </StrictMode>
);
