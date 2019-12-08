const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: './src/app/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      '@less-helpers-module': path.resolve(__dirname, 'src/assets/less/helpers'), // alias for less helpers
      '@assets-root-path': path.resolve(__dirname, 'src/assets') // alias for assets (use for images & fonts)
    }
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('autoprefixer')({
                'browsers': [
                  'chrome >= 65',
                  'firefox 60',
                  'last 1 edge versions',
                  'ios >= 11',
                  'ie >= 11',
                  'android >= 7'
                ]
              }),
            ]
          }
        },
        'less-loader'
      ]
    }, {
      test: /\.(jpg|jpeg|png|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]'
        }
      }]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }, {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: { 
          presets: ['env'],
          compact: false
        }
      }]
    }, {
      test: /\.hbs$/,
      loader: 'handlebars-loader',
      exclude: /(node_modules)/,
      query: {
        helpersDirs: [
          `${__dirname}/src/app/components/handlebars-helpers/`
        ]
      }
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new CopyWebpackPlugin([
      'src/index.html', // will copy to root of outDir (./dist folder)
      {
        from: 'src/static/',
        to: 'static'
      },
      {
        from: 'src/assets/images',
        to: 'images'
      }
    ])
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    port: 3000
  }
};
