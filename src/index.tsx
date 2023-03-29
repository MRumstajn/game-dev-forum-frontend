import React from "react";

import { ThemeProvider } from "@tiller-ds/theme";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { RequestInterceptor } from "./http-interceptor/RequestInterceptor";
import { ResponseInterceptor } from "./http-interceptor/ResponseInterceptor";
import reportWebVitals from "./reportWebVitals";
import {
  defaultComponentConfig,
  defaultIconConfig,
} from "./styles/tillerConfig";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

ResponseInterceptor();
RequestInterceptor();

root.render(
  <React.StrictMode>
    <ThemeProvider
      themeConfig={defaultComponentConfig}
      iconConfig={defaultIconConfig}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
