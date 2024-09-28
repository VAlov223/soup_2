const path = require("path");
const webpack = require("webpack");

//Path to static assets
const publicAssetsPath = "/static/soup";

module.exports = (env, argv) => {
  const config = {};

  //Media options
  const media = {};

  if (argv.mode === "development") {
    //For development we use entry that will display html page
    config.entry = path.resolve(__dirname, "./src/examples/index.tsx");

    //Simple bundle.js output
    config.output = {
      filename: "bundle.js",
      path: path.resolve(__dirname, "./build"),
    };

    config.plugins = [new webpack.HotModuleReplacementPlugin()];

    //For development we want to pack everything inside bundle.js
    config.externals = undefined;

    config.devServer = {
      //Make react router friendly
      historyApiFallback: true,
      hot: true,
      static: {
        directory: path.resolve(__dirname, "./src/examples"),
        publicPath: "/",
      },
    };
  } else {
    //For production we use entry that will resolve module
    config.entry = path.resolve(__dirname, "./src/examples/index.tsx");

    //Output with checksum to be cached
    config.output = {
      filename: "js/index.[contenthash].js",
      path: path.resolve(__dirname, "./build"),
      publicPath: publicAssetsPath,
    };

    //Pack all media
    media.outputPath = "media";
  }

  return {
    ...config,
    devtool: "source-map",

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        // {
        //   test: /\.css$/i,
        //   use: [
        //     "style-loader",
        //     {
        //       loader: "css-loader",
        //       options: {
        //         modules: true,
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|eot|svg|ttf|woff|woff2)$/i,
          type: "asset/resource",
          dependency: { not: ["url"] },
        },
      ],
    },

    resolve: {
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx", "*.css"],
    },
  };
};
