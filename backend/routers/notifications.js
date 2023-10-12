const router = require("express").Router();
const email = require("../jobs/email");
const sms = require("../jobs/sms");
const { jwtCheck, activeSubscription } = require("../middleware/middleware");

router.post("/sms", jwtCheck, activeSubscription, async (req, res) => {
  const { recipient, videoUrl } = req.body;
  sms
    .sendMessage(recipient, videoUrl)
    .then((message) => {
      res.status(200).json({ success: true, data: "SMS sent" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    });
});

router.post("/email", jwtCheck, activeSubscription, async (req, res) => {
  const { recipient, videoUrl } = req.body;
  const msg = email.buildResultEmail(recipient, videoUrl);
  email
    .sendEmail(msg)
    .then(() => {
      res.status(200).json({ success: true, data: "Email sent" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
