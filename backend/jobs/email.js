const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: "./backend/.env" });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function buildResultEmail(recipient, videoUrl) {
  return {
    to: `${recipient}`,
    from: "unoriginalai@gmail.com",
    templateId: "d-1693d00a5a5e48bd9e61d2d828c61978",
    dynamicTemplateData: {
      videoURL: `${videoUrl}`,
    },
  };
}

function sendEmail(msg) {
  return sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error.response.body);
      console.error(error);
    });
}

module.exports = {
  buildResultEmail,
  sendEmail,
};
