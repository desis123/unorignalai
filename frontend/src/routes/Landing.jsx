import React from "react";
import { HeroBanner } from "../components/hero-banner";
import MultipleVideos from "../components/videoslideshow";

function Landing() {
  React.useEffect(() => {
    if (window.location.pathname !== "/") window.location.pathname = "/";
  }, []);

  return (
    <>
      <HeroBanner />
      <MultipleVideos
        videoUrls={[
          "https://gallery-3.s3.us-east-2.amazonaws.com/24d39c4b-4b4c-4d97-b211-45385895bca1.mp4",
          "https://gallery-3.s3.us-east-2.amazonaws.com/1a8759a9-2b54-4c99-b34b-c5ac5f554f11-generic-1a8759a9-2b54-4c99-b34b-c5ac5f554f11-mpeg.mp4",
          "https://gallery-3.s3.us-east-2.amazonaws.com/78aee16c-3791-459b-90ca-7bb548f6c2f5-generic-78aee16c-3791-459b-90ca-7bb548f6c2f5-mpeg.mp4",
        ]}
      />
    </>
  );
}

export default Landing;
