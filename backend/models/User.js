const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    stripeCustomerId: String,
  }),
  "users"
);

module.exports = User;
