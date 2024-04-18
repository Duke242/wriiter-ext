const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "index.html" },
        { from: "src/dashboard.html", to: "dashboard.html" },
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/assets", to: "assets" },
      ],
    }),
    new webpack.EnvironmentPlugin(["SUPABASE_URL"]),
  ],
}
