const { getUser } = require("../jobs/user");
const jwksRsa = require("jwks-rsa");
const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  scope: "read:current_user",
  algorithms: ["RS256"],
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  jwksUri: process.env.AUTH0_JWKS_URI,
  audience: process.env.AUTH0_AUDIENCE,
});

const activeSubscription = (req, res, next) => {
  getUser(req.body.user.email)
    .then((user) => {
      if (user.isPlanActive) {
        next();
      } else {
        res.status(403).json({ message: "You need an active subscription" });
      }
    })
    .catch(() => {
      res.status(404).json({ message: "User not found" });
    });
};

const activeSubscriptionQuery = (req, res, next) => {
  const userEmail = req.query.email; // get the user email from the query string
  getUser(userEmail)
    .then((user) => {
      if (user.isPlanActive) {
        next();
      } else {
        res.status(403).json({ message: "You need an active subscription" });
      }
    })
    .catch(() => {
      res.status(404).json({ message: "User not found" });
    });
};

exports.activeSubscription = activeSubscription;
exports.activeSubscriptionQuery = activeSubscriptionQuery;
exports.jwtCheck = jwtCheck;
