import React from "react";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router";
import { NavBar } from "../components/navbar";
import { useAuth0 } from "@auth0/auth0-react";

import { Container } from "../components/container";

const MainContainer = styled(Container)`
  ${({ isHomePage }) =>
    isHomePage &&
    `
    max-width: 100%;
    padding: 0;
  `}
`;

function App() {
  const [auth, setAuth] = React.useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  // get token from auth0
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    const getAuth = () => {
      getAccessTokenSilently().then((token) => {
        setAuth(token);
      });
    };
    getAuth();
  }, [getAccessTokenSilently]);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (
        (window.location.search.includes("returnedFromPortal") ||
          window.location.search.includes("success") ||
          window.location.search.includes("canceled")) &&
        !window.location.pathname.includes("profile")
      ) {
        navigate({
          pathname: "/profile",
          search: window.location.search,
        });
      } else {
      }
    }
  }, [isAuthenticated, navigate, window.location.search]);

  return (
    <>
      <NavBar />
      <MainContainer isHomePage={location.pathname === "/"}>
        <Outlet context={{ auth, setAuth }} />
      </MainContainer>
    </>
  );
}

export default App;
