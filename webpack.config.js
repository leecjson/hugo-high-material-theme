'use strict';

const path = require('path');
const fs = require('fs-extra');
const hasha = require('hasha');
const autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');

module.exports = (env) => {
  env.MODE = env.MODE || 'production';
  const isEnvProduction = env.MODE == 'production';
  const manifestFilePath = path.join(__dirname, './data/asset-manifest.json');

  /**
   * Style loader
   */
  const getStyleLoaders = () => {
    return [
      { 
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      },
      { loader: 'css-loader' },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [autoprefixer()]
        }
      },
    ];
  };
  
  /**
   * @type {import('webpack').Configuration}
   */
  const exports = {
    mode: env.MODE,
    //evtool: 'source-map',
    entry: path.join(__dirname, './src/index.js'),
    output: {
      path: path.join(__dirname, './static/dist'),
      publicPath: "/dist/",
      filename: 'hash/[name].[contenthash].js',
      chunkFilename: 'hash/[name].[contenthash].chunk.js'
    },
    module: {
      rules: [
        // {
        //   test: /\.(png|jpg|tga|svg|gif|woff|woff2|eot|ttf|otf|mp4|mp3|ogg|avi|mov)$/,
        //   loader: 'file-loader',
        //   options: {
        //     name: '[name].[contenthash].[ext]',
        //     outputPath: 'hash',
        //     esModule: true,
        //   },
        // },
        // {
        //   resource: path.resolve(__dirname, './node_modules/@fortawesome/fontawesome-free/css/all.css'),
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         name: 'fontawesome.[contenthash].css',
        //         outputPath: 'hash',
        //         esModule: true,
        //       }
        //     },
        //     { loader: 'extract-loader'},
        //     ...getStyleLoaders(),
        //   ],
        // },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src'),
          use: getStyleLoaders(),
        },
        {
          test: /\.scss$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            ...getStyleLoaders(),
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                // See https://github.com/webpack-contrib/sass-loader/issues/804
                webpackImporter: false,
                sassOptions: {
                  includePaths: [path.join(__dirname, './node_modules')],
                },
              },
            }
          ],
        }
      ]
    }
  };
  
  exports.plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'hash/[name].[contenthash].css',
      chunkFilename: 'hash/[name].[contenthash].chunk.css',
    }),
    new ManifestPlugin({
      fileName: manifestFilePath,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          fileName => !fileName.endsWith('.map')
        );
        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    new EventHooksPlugin({
      done: () => {
        const fontawesomeDir = 'node_modules/@fortawesome/fontawesome-free';
        const allCssPath = path.join(__dirname, fontawesomeDir, 'css/all.min.css');
        const hash = hasha.fromFileSync(allCssPath, { algorithm: 'md5' });
        const cssRelPathName = `hash/fontawesome.${hash}`;
        const targetDir = path.resolve(exports.output.path, cssRelPathName);
        const targetCssPath = path.join(targetDir, `css/all.min.css`);
        fs.ensureDirSync(targetDir);
        fs.copySync(allCssPath, targetCssPath);
        fs.copySync(
          path.join(__dirname, fontawesomeDir, 'webfonts'),
          path.join(targetDir, 'webfonts')
        );
        const manifest = JSON.parse(fs.readFileSync(manifestFilePath));
        manifest.files['fontawesome.css'] = path.posix.join(exports.output.publicPath, cssRelPathName, 'css/all.min.css');
        fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2));
      },
    }),
  ];
  return exports;
};
