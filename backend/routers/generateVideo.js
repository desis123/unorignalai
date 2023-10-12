const router = require("express").Router();
const { jwtCheck, activeSubscription } = require("../middleware/middleware");
const uuid = require("uuid");
const Queue = require("bee-queue");

const videoQueue = new Queue("videoGeneration", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
  },
});

router.post("/", jwtCheck, activeSubscription, async (req, res) => {
  const videoId = uuid.v4();
  const data = req.body.data;

  const job = videoQueue.createJob({
    videoId: videoId,
    data: data,
    email: req.body.user.email,
  });
  job
    .timeout(900 * 1000)
    .retries(3)
    .backoff("exponential", 100);

  job.on("succeeded", (result) => {
    console.log(`Job ${job.id} succeeded with result: ${result}`);
    res.send({ videoId: videoId, videoUrl: result.videoUrl });
  });

  job.on("failed", (errorMessage) => {
    console.log(`Job ${job.id} failed with error message: ${errorMessage}`);
    res.status(500).send({ error: errorMessage });
  });

  job.save((err) => {
    if (err) {
      console.log(`Job ${job.id} failed with error message: ${err}`);
      res.status(500).send({ error: err });
    }
    console.log(`Job ${job.id} saved`);
  });
});

module.exports = router;
