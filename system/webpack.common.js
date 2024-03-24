const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const Files = [
  {
    name: "Popup",
    path: path.resolve("src/Popup/index.tsx"),
  },
  {
    name: "Background",
    path: path.resolve("src/Background/index.ts"),
  },
];

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "cheap-module-source-map",
  plugins: [new Dotenv({ path: "./system/.env" })],
  entry: Files.reduce((acc, file) => {
    acc[file.name] = file.path;
    return acc;
  }, {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss"],
    alias: {
      "@src": path.resolve("src"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/assets"),
          to: path.resolve("dist/assets"),
        },
        {
          from: path.resolve("src/_locales"),
          to: path.resolve("dist/_locales"),
        },
        {
          from: path.resolve("manifest.json"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(
      Files.filter((file) => file.path.slice(-3) === "tsx").map(
        (file) => file.name
      )
    ),
  ],
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve("dist"),
  },
  optimization: {
    minimize: false,
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      chunks(chunk) {
        return Files.find(
          (file) => file.name === chunk.name && file.path.slice(-3) === ".tsx"
        );
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: chunk,
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
