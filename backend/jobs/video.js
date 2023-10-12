(async () => {
  editly = await import("editly");
  editly = editly.default;
})();

const AWS = require("aws-sdk");

require("dotenv").config({ path: "./backend/.env" });
AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY,
});

const s3 = new AWS.S3({
  signatureVersion: "v4",
  params: { Bucket: "gallery-3" },
});

function buildClips(clips) {
  return clips.map((clip) => ({
    transition: { name: "fade", duration: 0.2 },
    duration: clip.duration,
    layers: [
      {
        type: "image",
        path: clip.image,
        width: 1080,
        height: 1920,
      },
      {
        type: "subtitle",
        text: clip.text,
        font: "Arial",
        fontSize: 100,
        color: "white",
        y: 100,
      },
      {
        type: "detached-audio",
        path: clip.audio,
        mixVolume: 50,
        start: 0.3,
      },
    ],
  }));
}

async function buildVideo(videoId, clips) {
  const editSpec = {
    outPath: `./videos/${videoId}.mp4`,
    width: 1080,
    height: 1920,
    fps: 30,
    allowRemoteRequests: true,
    clips: clips,
  };

  await editly(editSpec);
}

async function uploadVideoToS3(videoData, key) {
  const params = {
    Body: videoData,
    Bucket: "gallery-3",
    Key: `${key}.mp4`,
    ContentType: "audio/mpeg",
    Expires: 60 * 60 * 24 * 7,
  };

  return s3
    .upload(params)
    .promise()
    .catch((err) => {
      console.error(err.toString());
      return;
    })
    .then(async (_data) => {
      const url = await s3.getSignedUrlPromise("getObject", {
        Bucket: "gallery-3",
        Key: `${key}.mp4`,
      });
      return url;
    });
}

module.exports = {
  buildClips,
  buildVideo,
  uploadVideoToS3,
};
