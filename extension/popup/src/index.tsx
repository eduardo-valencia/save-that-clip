import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import * as Sentry from "@sentry/react";
import { Integration } from "@sentry/types/types/integration";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const createRoot = (): HTMLElement => {
  const rootElement = document.createElement("div");
  rootElement.id = "save-that-clip";
  document.body.appendChild(rootElement);
  return rootElement;
};

const createStyles = (): void => {
  const element = document.createElement("style");
  rootElement.appendChild(element);
};

const getIntegrations = (): Integration[] => {
  return [
    new Sentry.BrowserTracing({ tracePropagationTargets: ["localhost"] }),
    new Sentry.Replay(),
  ];
};

const initSentry = (): void => {
  Sentry.init({
    dsn: "https://a22d5586c674427c97ec220e784e23c2@o4505468162015232.ingest.sentry.io/4505468164112384",
    integrations: getIntegrations(),
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
  });
};

initSentry();

const rootElement: HTMLElement = createRoot();
createStyles();
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
