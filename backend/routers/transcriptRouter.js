const transcriptRouter = require("express").Router();
const cors = require("cors");
const { jwtCheck, activeSubscription } = require("../middleware/middleware");
require("dotenv").config();
transcriptRouter.use(cors());
const {
  getTranscript,
  getVideoId,
  transcriptObjectToString,
  getSummary,
} = require("../jobs/transcript");

transcriptRouter.post("/", jwtCheck, activeSubscription, async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({
        success: false,
        error: "Please provide a link",
      });
    }
    const videoId = getVideoId(link);
    const transcript = await getTranscript(videoId);
    if (!transcript) {
      throw new Error(
        "There was an error getting the transcript for this video"
      );
    }
    if (transcriptObjectToString(transcript).length > 2500) {
      throw new Error(
        "This video is too long. Please choose a shorter video to summarize."
      );
    }

    const chatGPTSummary = await getSummary(
      transcriptObjectToString(transcript)
    );

    if (!chatGPTSummary) {
      throw new Error("There was an error summarizing this video");
    }

    return res.status(200).json({
      success: true,
      data: chatGPTSummary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = transcriptRouter;
