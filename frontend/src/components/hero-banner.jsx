import React, { useRef } from "react";
import styled from "styled-components";
import { mobileMQ } from "../styles/mediaquery";

const HeroBannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  background-image: url("https://gallery-3.s3.us-east-2.amazonaws.com/wave-2.svg");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100%;
  color: var(--black);

  /* responsive */

  margin: 0 auto;
  padding: 10.2rem;

  ${mobileMQ(`{
    padding: 3.2rem 1.6rem;
  }`)}
`;

const HeroBannerHeadline = styled.h1`
  letter-spacing: -1.5px;
  font-weight: bolder;
  /* responsive */
  margin: 2.4rem 0 8px 0;
  font-size: 4.8rem;
  background: linear-gradient(45deg, #000080, #add8e6, #ffff00);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${mobileMQ(`{
    font-size: 3.2rem;
  }`)}
`;

const HeroBannerSmallHeadline = styled.h1`
  letter-spacing: -1.5px;
  font-weight: bolder;
  /* responsive */
  margin: 2.4rem 0 8px 0;
  font-size: 2.8rem;
  background: linear-gradient(45deg, #000080, #add8e6, #ffff00);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${mobileMQ(`{
  font-size: 3.2rem;
}`)}
`;

const HeroBannerDescription = styled.p`
  max-width: 58rem;
  text-align: center;

  /* responsive */
  margin-bottom: 3.2rem;
  font-size: 20px;
  line-height: 3.2rem;

  ${mobileMQ(`{
    font-size: 1.6rem;
    line-height: 2.4rem;
  }`)}
`;

const HeroBannerLink = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #fff;
  color: #000;
  border: none;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  margin-top: 2rem;
`;

export const HeroBanner = () => {
  const examplesRef = useRef(null);

  const scrollToExamples = (event) => {
    event.preventDefault();
    examplesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroBannerWrapper>
        <HeroBannerHeadline>Create UNORIGINAL Content.</HeroBannerHeadline>
        <HeroBannerDescription></HeroBannerDescription>
        <HeroBannerLink
          id="code-sample-link"
          target="_blank"
          href="/"
          onClick={scrollToExamples}
        >
          Check out samples →
        </HeroBannerLink>
      </HeroBannerWrapper>
      <div ref={examplesRef}>
        <HeroBannerSmallHeadline>Here's a few examples</HeroBannerSmallHeadline>
      </div>
    </>
  );
};
