const axios = require("axios");
const { chatGPT } = require("./chat.js"); // Import the example function
if (typeof fetch === "undefined") {
  global.fetch = require("cross-fetch");
}

function getVideoId(url) {
  if (!url) throw new Error("No Video URL provided");
  if (url.length === 11) return url;

  const match = url.match(
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/im
  );

  if (!match || !match.length > 1) throw new Error("Video URL invalid");

  return match[1];
}

async function getTranscript(url) {
  const id = getVideoId(url);

  let page = await axios.get(`https://www.youtube.com/watch?v=${id}`);
  const innerTubeApiKey = page.data.match(/"innertubeApiKey":"(.+?)"/)[1];

  if (!innerTubeApiKey) throw new Error("Could not find innerTubeApiKey");
  const title = page.data
    .match(/<title>([^<]*)<\/title>/)[1] // Updated this line
    .replace(" - YouTube", "")
    .trim();

  const params = page.data.split('"serializedShareEntity":"')[1]?.split('"')[0];

  if (!params) throw new Error("Could not find params");

  const data = {
    context: {
      client: {
        hl: "en",
        gl: "US",
        clientName: "WEB",
        clientVersion: "2.2021111",
      },
    },
    params,
  };

  const res = await axios.post(
    `https://www.youtube.com/youtubei/v1/get_transcript?key=${innerTubeApiKey}`,
    data
  );

  if (!res.data.actions)
    throw new Error(
      "This video may be too short, or may not have a transcript."
    );

  const transcriptsObject =
    res.data.actions[0].updateEngagementPanelAction.content.transcriptRenderer
      .body.transcriptBodyRenderer.cueGroups;

  if (!transcriptsObject)
    throw new Error(
      "This video may be too short, or may not have a transcript."
    );

  const transcript = transcriptsObject.map((cue) => {
    const text =
      cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.cue
        .simpleText;
    const duration = parseInt(
      cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.durationMs
    );
    const offset = parseInt(
      cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.startOffsetMs
    );

    return { text: text, duration: duration, offset: offset };
  });

  return { transcript, title };
}

function transcriptObjectToString(transcript) {
  return transcript.transcript.map((cue) => cue.text).join(" ");
  // return transcript;
}

async function getSummary(text, title) {
  const prompt = `For the video titled ${title}, summarize in 100 words or less, begin the summary with an interesting hook to capture the attention of the user. Make every sentence less short and concise.
            ${text}
          `;
  const summary = await chatGPT(prompt);
  return summary;
}

module.exports = {
  getTranscript,
  transcriptObjectToString,
  getVideoId,
  getSummary,
};
