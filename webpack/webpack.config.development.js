import path from 'path'
import webpack from 'webpack'

const root = process.cwd()
const src = path.join(root, 'src')

const clientSrc = path.join(src, 'client')
const universalSrc = path.join(src, 'universal')

const clientInclude = [clientSrc, universalSrc]

const babelQuery =
{
  'presets': [
    '@babel/preset-react',
    [ '@babel/preset-env', {
      'targets': {
        'browsers': '> 2%'
      }
    }],
    ['@babel/preset-stage-0', {
      'decoratorsLegacy': true
    }]
  ]
}

module.exports = {
  devtool: 'eval',
  context: src,
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?noInfo=false',
      './client/client.js'
    ]
  },
  output: {
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': false,
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules']
  },
  module: {
    loaders: [
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      },

      // Javascript
      {test: /\.js$/,
        loader: 'babel-loader',
        query: babelQuery,
        include: clientInclude
      },

      // CSS
      {test: /\.css$/,
        include: clientInclude,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader',
            options: {
              root: src,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }}
        ]
      }
    ]
  }
}
