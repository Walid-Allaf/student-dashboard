import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import "./i18n";
import { ContextProvider } from "./contexts/ContextProvider";
import { ThemeProvider } from "@emotion/react";
import { Toaster } from "react-hot-toast";
import theme from "./themes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <ContextProvider>
      <App />
      <Toaster />
    </ContextProvider>
  </ThemeProvider>
);
