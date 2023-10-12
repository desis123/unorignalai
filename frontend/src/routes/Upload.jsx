import React, { useState } from "react";
import styled from "styled-components";
import { ChildContainer } from "../components/container";
import DragDrop from "../components/dropzone";
import { get, post } from "../../src/api/api-service.js";
import { FormInput, FormTextArea } from "../components/formInput";
import { Button } from "../components/button";
import { useAuth0 } from "@auth0/auth0-react";
import { tabletMQ } from "../styles/mediaquery";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const H1 = styled.h1`
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 2.5rem;
  font-weight: bold;
  margin: 2rem 0;
`;

const Error = styled.p`
  color: ${({ theme }) => theme.colors.error};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;

  & > * {
    margin-bottom: 1rem;
    width: 100%;
  }
`;

// should  maintain vertical aspect ratio of 1920x1080 but scale to fit
const Video = styled.video`
  width: 40%;
  height: auto;
  border-radius: 20px;
  margin-top: 2rem;
  ${tabletMQ(`width: 100%`)}
`;

const Input = styled(FormInput)`
  width: 100%;
`;

const PhoneInputStyled = styled(PhoneInput)`
  input {
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    margin: 10px 0;
    padding: 12px;
    width: 100%;
  }
`;

const SpaceBetweenRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MarginLeftButton = styled(Button)`
  margin-left: 10px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TextButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.tertiary};
  border: none;
  padding: 5px;
  color: ${({ theme }) => theme.colors.error};
`;

const BlueTextButton = styled(TextButton)`
  color: ${({ theme }) => theme.colors.primary};
`;

// Add a new styled component for the divider
const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
`;

const DividerLine = styled.hr`
  flex-grow: 1;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const PlusButton = styled(Button)`
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Card = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const RemoveSectionButton = styled(Button)`
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 15%;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  width: 40px;
  color: red;
  background-color: transparent;
  border-color: red;
  height: 40px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${({ theme }) => theme.colors.black};
    border: none;
    color: white;
  }
`;

const FlexEndRow = styled(Row)`
  justify-content: flex-end;
`;

const Modal = styled.div`
  position: fixed;
  ${({ isOpen }) => (isOpen ? `display: block;` : `display: none;`)}
  z-index: 99;
  bottom: 50%;
  right: 0;
  left: 0;
  padding: 20px;
  top: 50%;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 400px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  margin: auto;
  overflow: auto;
`;

const GreyBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  z-index: 98;
  left: 0;
  ${({ isOpen }) => (isOpen ? `display: block;` : `display: none;`)}
  top: 0;
  width: 100%;
  height: 100%;
`;

const Button2 = styled(Button)`
  margin-right: 0;
`;

function Upload() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [stage, setStage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");
  const [summaryList, setSummaryList] = useState([]);
  const [isPlanActive, setIsPlanActive] = useState(undefined);
  const [videoLink, setVideoLink] = useState(undefined);
  const [phone, setPhone] = useState("");
  const [isSMSSent, setIsSMSSent] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);

  React.useEffect(() => {
    if (!user?.email) {
      return;
    }
    const fetchData = () => {
      try {
        getAccessTokenSilently().then((token) => {
          get(`api/users?email=${user.email}`, token, user).then((res) => {
            setIsPlanActive(!!res.data.isPlanActive || false);
          });
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [user, getAccessTokenSilently]);

  React.useEffect(() => {
    setError(null);
  }, [stage]);

  // Create a new function to render the divider
  const renderDivider = (index) => {
    if (index === summaryList.length - 1) {
      return null;
    }

    return (
      <Divider>
        <DividerLine />
        <PlusButton
          isInverted
          name="+"
          isDisabled={summaryList.length >= 5 || isLoading}
          onClick={() => {
            if (summaryList.length >= 5) {
              setError("You can only add up to 5 sections");
              return;
            }

            setSummaryList([
              ...summaryList.slice(0, index + 1),
              { text: "", imageURL: "" },
              ...summaryList.slice(index + 1),
            ]);
          }}
        />
        <DividerLine />
      </Divider>
    );
  };

  const handleSubmitStage1 = (event) => {
    event.preventDefault();
    setIsLoading(true);

    getAccessTokenSilently()
      .then((token) => {
        return post("api/transcript/", { link, user }, token);
      })
      .then((response) => {
        const responseData = response.data;
        setStage(2);
        setIsLoading(false);

        const modifiedData = responseData.data?.replace(
          /([.!?])(\s|$)/g,
          "$1\n$2"
        );
        const summaryText = modifiedData.split("\n");
        const newSummaryList = summaryText
          .map((text, index) => {
            if (text.trim() !== "") {
              return {
                text: text,
                imageURL: "",
              };
            }
            return null;
          })
          .filter((item) => item !== null && item.text.trim() !== "");

        // if (newSummaryList.length > 5)
        // combine adjacent sections until there are 5 sections

        if (newSummaryList.length > 5) {
          try {
            const combinedSummaryList = [];
            let i = 0;
            while (i < newSummaryList.length) {
              if (i + 1 < newSummaryList.length) {
                combinedSummaryList.push({
                  text: newSummaryList[i].text + newSummaryList[i + 1].text,
                  imageURL: "",
                });
                i += 2;
              } else {
                combinedSummaryList.push(newSummaryList[i]);
                i += 1;
              }
            }
            setSummaryList(combinedSummaryList);
          } catch (e) {
            setSummaryList(newSummaryList);
          }
        } else {
          setSummaryList(newSummaryList);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response?.status === 429) {
          setError(
            "You have exceeded the maximum number of requests. Please try again in 15 minutes."
          );
          return;
        } else {
          setError(
            e.response?.data?.error ?? "Something went wrong. Please try again."
          );
        }
      });
  };

  const handleSubmitStage2 = (event) => {
    event.preventDefault();
    setIsLoading(true);

    getAccessTokenSilently()
      .then((token) => {
        return post("api/generate", { data: summaryList, user }, token);
      })
      .then((response) => {
        setVideoLink(response.data?.videoUrl);
        setStage(3);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response?.status === 429) {
          setError(
            "You have exceeded the maximum number of requests. Please try again in 15 minutes."
          );
        } else if (e.response?.status === 504) {
          setError(
            "Your video is taking a bit more time to generate. Please check your email in a few minutes."
          );
        } else {
          setError(
            e.response?.data?.error ??
              "This is taking a while. Either the queue is full, or your images or text may have been too long." +
                " If you do not receive a video from us in your email, please try again."
          );
        }
      });
  };

  const stage1 = () => (
    <>
      <H1>Enter a link. Add images. Wait for Magic.</H1>
      <Form onSubmit={handleSubmitStage1}>
        <Input
          isDisabled={isLoading}
          type="text"
          placeholder="Enter a YouTube link"
          value={link}
          name="link"
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
        <Row>
          <BlueTextButton
            type="button"
            name="Skip this step & create video"
            onClick={() => {
              setSummaryList([{ text: "" }]);
              setStage(2);
            }}
          />
          <Button
            type="submit"
            name={isLoading ? "Loading..." : "Continue"}
            isDisabled={isLoading || link === ""}
          />
        </Row>
        {error && <Error>{error}</Error>}
      </Form>
    </>
  );

  const stage2 = () => (
    <>
      {summaryList.length < 1 ? (
        <p>Something went wrong. Please try again.</p>
      ) : (
        <>
          {summaryList.length > 2 && error && <Error>{error}</Error>}
          {summaryList.map((item, index) => (
            <React.Fragment key={index}>
              <Card key={index}>
                {index >= 1 && (
                  <RemoveSectionButton
                    name="X"
                    onClick={() => {
                      setSummaryList(
                        summaryList.filter((item, i) => i !== index)
                      );
                    }}
                  />
                )}
                <SpaceBetweenRow>
                  <DragDrop
                    isDisabled={isLoading}
                    onUpload={(s3URL) => {
                      setSummaryList(
                        summaryList.map((item, i) =>
                          i === index ? { ...item, imageURL: s3URL } : item
                        )
                      );
                    }}
                  />
                  <FormTextArea
                    isDisabled={isLoading}
                    value={item.text}
                    onChange={(e) => {
                      if (e.target.value.length >= 300) {
                        setError(
                          "You have exceeded the maximum number of characters. Please remove some text."
                        );
                        return;
                      }

                      if (error && error.includes("characters")) {
                        setError(null);
                      }

                      setSummaryList(
                        summaryList.map((item, i) =>
                          i === index ? { ...item, text: e.target.value } : item
                        )
                      );
                    }}
                  />
                </SpaceBetweenRow>
              </Card>
              {renderDivider(index)}
            </React.Fragment>
          ))}
          <p>
            You only get 3 tries every 15 minutes so be careful! Also make sure
            to upload images to each card in order to proceed.
          </p>
          <p>
            Note: you can have a maximum of 5 images, and 300 characters in each
            textbox.
          </p>
          <Row>
            <Button
              isInverted
              isDisabled={isLoading || summaryList.length >= 5}
              name="Add Section"
              onClick={() => {
                if (summaryList.length >= 5) {
                  setError(
                    "You have reached the maximum number of sections. Please remove a section to add another."
                  );
                  return;
                }

                setSummaryList([
                  ...summaryList,
                  {
                    text: "",
                    imageURL: "",
                  },
                ]);
              }}
            />
            {summaryList.some(
              (item) => !item.text || item.text.length > 300 || !item.imageURL
            )}
            <MarginLeftButton
              name={isLoading ? "Loading..." : "Continue"}
              isDisabled={
                isLoading ||
                summaryList.some(
                  (item) =>
                    !item.text || item.text.length > 300 || !item.imageURL
                ) ||
                summaryList.length > 5 ||
                summaryList.length < 1
              }
              onClick={handleSubmitStage2}
            />
          </Row>
          {error && <Error>{error}</Error>}
        </>
      )}
    </>
  );

  const stage3 = () => (
    <>
      <H1>Your video is ready!</H1>
      <Row>
        <Button
          isInverted
          name="Copy Video Link to Clipboard"
          onClick={() => {
            navigator.clipboard.writeText(videoLink);
          }}
        />

        <Button
          isInverted
          name="Share"
          onClick={() => {
            setIsShareOpen(true);
          }}
        />
      </Row>
      {videoLink && (
        <Video controls>
          <source src={videoLink} type="video/mp4" />
          Your browser does not support the video tag.
        </Video>
      )}
      <GreyBackground isOpen={isShareOpen} />
      <Modal isOpen={isShareOpen}>
        <p>Share it directly via SMS: </p>
        <PhoneInputStyled
          placeholder="Enter phone number"
          defaultCountry="CA"
          value={phone}
          onChange={setPhone}
        />
        <FlexEndRow>
          <Button2
            name={isSMSSent ? "Sent!" : "Send SMS"}
            isDisabled={!phone || isSMSSent}
            onClick={() => {
              setIsSMSSent(true);
              getAccessTokenSilently().then((token) => {
                return post(
                  "api/notifications/sms",
                  { recipient: phone, videoUrl: videoLink, user },
                  token
                ).catch((e) => {
                  console.log(e);
                });
              });
            }}
          />
        </FlexEndRow>
        <Input
          type="text"
          label="Or share it directly via email:"
          placeholder="example@gmail.com"
          value={email}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <FlexEndRow>
          <Button2
            name={isEmailSent ? "Sent!" : "Send Email"}
            isDisabled={!email || isEmailSent}
            onClick={() => {
              setIsEmailSent(true);
              getAccessTokenSilently().then((token) => {
                return post(
                  "api/notifications/email",
                  { recipient: email, videoUrl: videoLink, user },
                  token
                ).catch((e) => {
                  console.log(e);
                });
              });
            }}
          />
        </FlexEndRow>
        <FlexEndRow>
          <Button2
            isInverted
            name="Close"
            onClick={() => {
              setIsShareOpen(false);
            }}
          />
        </FlexEndRow>
      </Modal>
    </>
  );

  return (
    <>
      <ChildContainer>
        {isPlanActive ? (
          <>
            {stage === 2 && stage2()}
            {stage === 1 && stage1()}
            {stage === 3 && stage3()}
          </>
        ) : (
          <>
            {isPlanActive === undefined ? (
              <></>
            ) : (
              <H1>Please upgrade your plan to use this feature.</H1>
            )}
          </>
        )}
      </ChildContainer>
    </>
  );
}

export default Upload;
