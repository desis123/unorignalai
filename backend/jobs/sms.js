require("dotenv").config({ path: "./backend/.env" });
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    autoRetry: true,
    maxRetries: 3,
  }
);

function sendMessage(recipient, videoUrl) {
  return client.messages.create({
    body: `Your Unoriginal AI video is ready!\n\n${videoUrl}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: recipient,
  });
}

module.exports = {
  sendMessage,
};
