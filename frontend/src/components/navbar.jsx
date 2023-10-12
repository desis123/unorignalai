import React from "react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

import { Container } from "../components/container";
const NavbarContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  height: unset;
`;

const NavBarButtonsDiv = styled.div``;
const NavBarLogo = styled.img`
  height: 2.2rem;
`;
export const NavBar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const navigate = useNavigate();
  return (
    <NavbarContainer>
      <NavBarLogo
        src="https://gallery-3.s3.us-east-2.amazonaws.com/asdasdasd_3_black.png"
        alt="Gallery 3 Logo"
        onClick={() => {
          navigate("/");
        }}
      />

      <NavBarButtonsDiv>
        {!isAuthenticated ? (
          <>
            <Button
              name="Login & Sign Up"
              onClick={() => {
                loginWithRedirect();
              }}
            />
          </>
        ) : (
          <>
            <Button
              name="My Profile"
              onClick={() => {
                navigate("/profile");
              }}
              isInverted
            />
            <Button
              name="Upload"
              onClick={() => {
                navigate("/upload");
              }}
              isInverted
            />
            <Button
              name="Logout"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            />
          </>
        )}
      </NavBarButtonsDiv>
    </NavbarContainer>
  );
};
