require("dotenv").config({ path: "./backend/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const app = express();
const db = require("./models");
const uploadRouter = require("./routers/uploadRouter");
const stripeRouter = require("./routers/stripeRouter");
const usersRouter = require("./routers/usersRouter");
const generateVideo = require("./routers/generateVideo");
const notifications = require("./routers/notifications");
const transcriptRouter = require("./routers/transcriptRouter");
app.use(cors());

// Configure the rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply the rate limiter to all requests
app.use(limiter);

app.use(
  bodyParser.json({
    // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
    verify: function (req, res, buf) {
      var url = req.originalUrl;
      if (url.includes("stripe/webhook")) {
        req.rawBody = buf;
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((e) => {
    console.log(e);
    process.exit();
  });

app.use("/api/stripe/", stripeRouter);
app.use("/api/users/", usersRouter);
app.use("/api/generate", generateVideo);
app.use("/api/notifications", notifications);
app.use("/api/upload/", uploadRouter);

const generateUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
});
app.use("/api/generate/", generateUploadLimiter, generateVideo);
app.use("/api/transcript/", generateUploadLimiter, transcriptRouter);

app.listen(process.env.SERVER_PORT, () =>
  console.log("server is runnning at port " + process.env.SERVER_PORT)
);
