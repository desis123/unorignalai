const router = require("express").Router();
const User = require("../models/User");
const { getUser } = require("../jobs/user");
const { jwtCheck } = require("../middleware/middleware");

router.get("/", jwtCheck, async (req, res) => {
  getUser(req.query.email)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(404).json({ message: "User not found" });
    });
});

// patch user by email
router.patch("/", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { name: req.body.name },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...others } = JSON.parse(JSON.stringify(user));

    res.status(200).json(others);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
