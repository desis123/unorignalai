import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/app.css";
import "./styles/button.css";
import App from "./routes/App";
import AppCSS from "./styles/app.css";
import theme from "./styles/theme.js";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import Landing from "./routes/Landing";
import Profile from "./routes/Profile";
import Upload from "./routes/Upload";
import Credits from "./routes/Credits";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";

const GlobalStyle = createGlobalStyle`${AppCSS}`;

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        useRefreshTokens={true}
        cacheLocation="localstorage"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              {/* show landing if just / */}
              <Route path="/" element={<Landing />} />
              <Route
                path="/upload"
                element={<ProtectedRoute component={Upload} />}
              />
              <Route path="*" element={<Landing />} />
              <Route
                path="/Profile"
                element={<ProtectedRoute component={Profile} />}
              />
            </Route>
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </BrowserRouter>
      </Auth0Provider>
    </ThemeProvider>
  </React.StrictMode>
);
