const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

require("dotenv").config({ path: "./.env" });

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  // set app path to src
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        // both .js and .jsx
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      favicon: "./public/favicon.ico",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        REACT_APP_AUTH0_DOMAIN: JSON.stringify(
          process.env.REACT_APP_AUTH0_DOMAIN
        ),
        REACT_APP_AUTH0_CLIENT_ID: JSON.stringify(
          process.env.REACT_APP_AUTH0_CLIENT_ID
        ),
        REACT_APP_API_ENDPOINT: JSON.stringify(
          process.env.REACT_APP_API_ENDPOINT
        ),
        REACT_APP_SERVER_PORT: JSON.stringify(
          process.env.REACT_APP_SERVER_PORT
        ),
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
    open: true,
    port: 3000,
  },
};
