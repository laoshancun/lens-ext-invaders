/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require("path");

module.exports = [
  {
    entry: "./main.ts",
    context: __dirname,
    target: "electron-main",
    mode: "production",
    // devtool: "eval-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              }
            }
          ],
          exclude: /node_modules/,

        },
        {
          test: /\.s?css$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader",
          ]
        }
      ],
    },
    externals: [
      {
        "@k8slens/extensions": "var global.LensExtensions",
        "mobx": "var global.Mobx",
        "react": "var global.React",
        "mobx-react": "var global.MobxReact"
      }
    ],
    optimization: {
      minimize: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      libraryTarget: "commonjs2",
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
    },
  },
  {
    entry: "./renderer.tsx",
    context: __dirname,
    target: "electron-renderer",
    mode: "production",
    // devtool: "eval-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              }
            }
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader",
          ]
        }
      ],
    },
    optimization: {
      minimize: true,
    },
    externals: [
      {
        "@k8slens/extensions": "var global.LensExtensions",
        "react": "var global.React",
        "mobx": "var global.Mobx"
      }
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      libraryTarget: "commonjs2",
      globalObject: "this",
      filename: "renderer.js",
      path: path.resolve(__dirname, "dist"),
    },
    node: {
      __dirname: false,
      __filename: false
    }
  },
];
