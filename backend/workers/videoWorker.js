const {
  generateCaptions,
  generateMp3Buffer,
  uploadAudioToS3,
} = require("../jobs/tts.js");
const { buildClips, buildVideo, uploadVideoToS3 } = require("../jobs/video.js");
const fs = require("fs");
const Queue = require("bee-queue");

const { buildResultEmail, sendEmail } = require("../jobs/email");
const Xvfb = require("xvfb");
const videoQueue = new Queue("videoGeneration", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
  },
  removeOnFailure: true,
  removeOnSuccess: true,
});

videoQueue.on("ready", () => {
  // Run this in a virtual frame buffer
  // This allows our video generation to run without a display
  // Prevents all issues regarding deploying on server w/ docker
  if (!process.env.DEV_MODE) {
    var xvfb = new Xvfb({
      silent: false,
      xvfb_args: ["-screen", "0", "1080x1920x24", "-ac"],
    });
  }
  try {
    if (!process.env.DEV_MODE) {
      xvfb.startSync();
    }
    console.log("videoGeneration queue is ready");
    videoQueue.process(async (job) => {
      try {
        console.log("Processing job", job.id);
        const lines = await Promise.all(
          job.data.data.map(async (dataObj, index) => {
            const audioBuffer = await generateMp3Buffer(dataObj.text);
            const captions = await generateCaptions(dataObj.text);
            const audioURL = await uploadAudioToS3(
              audioBuffer,
              job.data.videoId + "/tts" + index
            );

            return {
              duration:
                (captions[captions.length - 1].time - captions[0].time) / 1000 +
                1,
              image: dataObj.imageURL,
              text: dataObj.text,
              audio: audioURL,
            };
          })
        );

        const clips = buildClips(lines);
        await buildVideo(job.data.videoId, clips);

        const videoData = fs.readFileSync(`./videos/${job.data.videoId}.mp4`);
        const videoUrl = await uploadVideoToS3(videoData, job.data.videoId);

        console.log("Job", job.id, "finished", "videoUrl: ", videoUrl);
        if (job.data.email) {
          const email = buildResultEmail(job.data.email, videoUrl);
          sendEmail(email);
        } else {
          console.log("No email provided");
        }
        return { videoUrl: videoUrl };
      } catch (err) {
        console.error(`Error processing job ${job.id}:`, err.toString());
        done(err);
      }
    });
  } catch (error) {
    console.log("Error in Xvfb:", error);
  }

  console.log("Waiting for jobs...");
});

videoQueue.on("error", (err) => {
  console.log(`A queue error happened: ${err.message}`);
});
