const AWS = require("aws-sdk");

require("dotenv").config({ path: "./backend/.env" });
AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY,
});

const polly = new AWS.Polly();
const s3 = new AWS.S3({
  signatureVersion: "v4",
  params: { Bucket: "gallery-3" },
});

async function generateCaptions(transcript) {
  return polly
    .synthesizeSpeech({
      Text: transcript,
      VoiceId: "Joanna",
      OutputFormat: "json",
      SpeechMarkTypes: ["word"],
    })
    .promise()
    .catch((err) => {
      console.error(err.toString());
    })
    .then((data) => {
      const speechMarks = data.AudioStream.toString("utf-8");
      const speechMarksArray =
        "[" + speechMarks.replace(/[\n](?=.*[\n])/g, ",") + "]";
      return JSON.parse(speechMarksArray);
    });
}

async function generateMp3Buffer(transcript) {
  return polly
    .synthesizeSpeech({
      Text: transcript,
      VoiceId: "Joanna",
      OutputFormat: "mp3",
    })
    .promise()
    .catch((err) => {
      console.error(err.toString());
      return;
    })
    .then((data) => {
      return data.AudioStream;
    });
}

async function uploadAudioToS3(audioBuffer, key) {
  const params = {
    Body: audioBuffer,
    Bucket: "gallery-3",
    Key: `${key}.mp3`,
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
        Key: `${key}.mp3`,
      });
      return url;
    });
}

module.exports = {
  generateCaptions,
  generateMp3Buffer,
  uploadAudioToS3,
};
