var path = require('path')
var webpack = require('webpack')
const { replaceInModuleSource, getAllModules } = require('svg-sprite-loader/lib/utils');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  // devtool: '#eval-source-map',
  devtool: false,
  plugins: [
    { // replace sprite Url with hash, but this doesn't work
      apply(compiler) {
        compiler.plugin('emit', (compilation, done) => {
          const { assets } = compilation;
          const spriteFilename = 'my-hashed-spritename'

          getAllModules(compilation).forEach((module) => {
            replaceInModuleSource(module, {
              __SPRITE_URL__: spriteFilename
            });
          });

          done();
        });
      }
    },
  ]
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
