## birincil paketler

yarn add react react-dom react-async react-redux redux @reduxjs/toolkit reduxed-chrome-storage @emotion/react @emotion/styled @mui/icons-material @mui/lab @mui/material moment moment-timezone sass socket.io-client@2.5.0

## gelistirme surecinde gerekli olan paketler

yarn add -D @types/chrome @types/react @types/react-dom css-loader sass-loader style-loader ts-loader typescript dotenv dotenv-webpack webpack webpack-cli copy-webpack-plugin css-minimizer-webpack-plugin html-webpack-plugin mini-css-extract-plugin

## scripts

```
"start": "webpack --mode=development --watch --progress --config system/webpack.common.js",
"build": "webpack --mode=production --watch --progress --config system/webpack.common.js"
```

## Webpack import

```
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
```

## Webpack` in render edecegi sayfalar

1. Popup.html
2. Background.js

```
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
```

# Manifest dosyasi

# Gerekli izinler

1. storage
2. notifications
