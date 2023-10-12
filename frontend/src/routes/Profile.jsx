import React from "react";
import styled, { useTheme } from "styled-components";
import { get, post } from "../../src/api/api-service.js";
import { Button } from "../components/button";
import { useAuth0 } from "@auth0/auth0-react";
import { ChildContainer } from "../components/container";

// in this page I want on desktop to gave one section with users info i.e email
// in the next section I want them to connect to stripe with a button

const DetailsContainer = styled.div`
  display: flex;
  margin: 20px 0;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const StyledButton = styled(Button)`
  margin: 0 !important;
`;

function Profile() {
  // TODO: get user info from backend
  // TODO: check if user is connected to stripe first
  const [formState, setFormState] = React.useState({
    name: "",
  });
  const { user, getAccessTokenSilently } = useAuth0();
  const theme = useTheme();
  let [success, setSuccess] = React.useState(false);
  let [session_id, setSessionId] = React.useState("");

  React.useEffect(() => {
    if (!user?.email) return;

    getAccessTokenSilently().then((token) => {
      get(`api/users?email=${user.email}`, token).then((res) => {
        setFormState({
          ...formState,
          name: res.data.name,
          session_id: res.data.session_id,
          isPlanActive: res.data.isPlanActive,
        });
        if (res.data.session_id) {
          setSuccess(true);
          setSessionId(res.data.session_id);
        }
      });
    });
  }, [user]);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id"));
      if (query.get("session_id")) {
        getAccessTokenSilently().then((token) => {
          post(
            "api/stripe/save-customer-id",
            {
              session_id: query.get("session_id"),
              email: user.email,
            },
            token
          ).then((res) => {
            setFormState({
              ...formState,
              isPlanActive: res.data.isPlanActive,
            });
          });
        });
      }
      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}`
      );
    }

    if (query.get("canceled")) {
      setSuccess(false);
      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}`
      );
    }

    if (query.get("returnedFromPortal")) {
      window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}`
      );
    }
  }, [window.location.search]);

  const renderStripe = () => {
    if (success && session_id !== "") {
      return (
        <>
          <StyledButton
            onClick={() => {
              getAccessTokenSilently().then((token) => {
                post(
                  "api/stripe/create-portal-session",
                  {
                    session_id: session_id,
                    email: user.email,
                  },
                  token
                ).then((res) => {
                  window.location.href = res.data.url;
                });
              });
            }}
            color={theme.colors.primary}
            name="Manage Subscription"
          />
          <h5>
            {formState.isPlanActive
              ? "You are subscribed to Unoriginal AI ($9.99/mo)"
              : "Your plan is no longer active"}
          </h5>
        </>
      );
    } else {
      return (
        <StyledButton
          onClick={() => {
            getAccessTokenSilently().then((token) => {
              post(
                "api/stripe/create-checkout-session",
                {
                  email: user.email,
                },
                token
              ).then((res) => {
                window.location.href = res.data.url;
              });
            });
          }}
          color={theme.colors.primary}
          name="Subscribe ($9.99/month)"
        />
      );
    }
  };

  return (
    <ChildContainer>
      <DetailsContainer>
        <h3>Profile</h3>
        <h5>{user?.email}</h5>
        <h2>Subscriptions</h2>
        {renderStripe()}
      </DetailsContainer>
    </ChildContainer>
  );
}

export default Profile;
