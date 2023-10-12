const mongoose = require("mongoose");

const Render = mongoose.model(
  "Render",
  new mongoose.Schema({
    name: String,
    description: String,
    render: String, // render will be a URL to the render
  })
);

module.exports = Render;
