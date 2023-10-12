import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { tabletMQ } from "../styles/mediaquery";

const Video = styled.video`
  width: 20%;
  height: auto;
  border-radius: 20px;
  margin: 1rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;

  ${tabletMQ(`
    flex-direction: column;
    align-items: center;
  `)}
`;

const StyledText = styled.div`
  background-color: #000;
  padding: 30px;
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 0.5;
  line-height: 1.5;

  a {
    color: #fff;
    text-decoration: underline;
  }
`;

const MultipleVideos = ({ videoUrls }) => {
  return (
    <div>
      <FlexContainer>
        {videoUrls.map((url, index) => (
          <Video key={index} controls>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>
        ))}
      </FlexContainer>
      <StyledText>
        Leverage AI to generate powerful compelling videos in a matter of
        seconds. Just enter in an existing YouTube video link (or skip it) and
        insert the images that you want to be displayed in your video. Let us
        handle the rest.{" "}
        <Link to="/credits">
          Click here to view the credits for this project.
        </Link>
      </StyledText>
    </div>
  );
};

export default MultipleVideos;
