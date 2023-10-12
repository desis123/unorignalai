const uploadRouter = require("express").Router();
const uuid = require("uuid");
const AWS = require("aws-sdk");
const cors = require("cors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { jwtCheck, activeSubscription } = require("../middleware/middleware");
require("dotenv").config();
uploadRouter.use(cors());

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY,
});

const s3 = new AWS.S3({
  signatureVersion: "v4",
  params: { Bucket: "gallery-3" },
  s3ForcePathStyle: true,
  signatureCache: false,
  expiresIn: 60 * 60 * 24 * 7, // Set the Expires value here
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "gallery-3",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, uuid.v4() + ".jpg");
    },
  }),
});

const handleS3Upload = (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  // The file has been uploaded by multer-s3, now get the signed URL
  s3.getSignedUrlPromise("getObject", {
    Bucket: "gallery-3",
    Key: file.key,
    Expires: 60 * 60 * 24 * 7, // Set the Expires value here
  })
    .then((url) => {
      console.log("File uploaded to S3:", url);
      res.json({ url });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error generating signed URL" });
    });
};

uploadRouter.post(
  "/s3",
  jwtCheck,
  upload.single("file"),
  handleS3Upload,
  activeSubscription
);

uploadRouter.delete("/s3", jwtCheck, activeSubscription, async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "No file URL provided." });
  }

  const matched = url.match(
    /https:\/\/s3\..+\.amazonaws\.com\/(.+?)\/(.+?)(\?.+)?$/
  );
  const key = matched ? matched[2] : null;
  if (!key) {
    return res.status(400).json({ message: "Invalid file URL." });
  }

  try {
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME || "gallery-3",
        Key: key,
      })
      .promise();
    console.log("File deleted from S3:", url);
    res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

uploadRouter.post(
  "/",
  jwtCheck,
  activeSubscription,
  upload.single("file"),
  (req, res) => {
    // on failure
    if (!req.files) {
      res.status(500).send("Error uploading file.");
    }
    // on success
    res.status(200).send(req.files[0].location);
  }
);
module.exports = uploadRouter;
