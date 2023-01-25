const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = (env, argv) => {
  
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',
    stats: 'minimal',

    entry: {
      index: 'src/views/pages/index/index.pug',
      apps: 'src/views/pages/apps/index.pug',
      downloads: 'src/views/pages/downloads/index.pug',
      investors: 'src/views/pages/investors/index.pug',
      news: 'src/views/pages/news/index.pug',
      startup: 'src/views/pages/startup/index.pug',
      team: 'src/views/pages/team/index.pug'
    },

    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: 'auto',
      filename: 'assets/js/[name].[contenthash:8].js',
      chunkFilename: 'assets/js/[name].[id].js',
      clean: true,
    },

    resolve: {
      alias: {
        Views: path.join(__dirname, 'src/views/'),
        Images: path.join(__dirname, 'src/assets/images/'),
        Fonts: path.join(__dirname, 'src/assets/fonts/'),
        Styles: path.join(__dirname, 'src/assets/styles/'),
        Scripts: path.join(__dirname, 'src/assets/scripts/'),
      },
    },

    plugins: [
      new PugPlugin({
        pretty: !isProd,        
        extractCss: {
          filename: 'assets/css/[name].[contenthash:8].css',
        },
      }),
    ],

    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader,
          options: {
            embedFilters: {
              escape: true,
            },
          },
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader'],
        },

        // fonts
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          type: 'asset/resource',
          include: /assets[\\/]fonts/,
          generator: {
            filename: 'assets/fonts/[name][ext][query]',
          },
        },

        // images
        {
          test: /\.(png|svg|jpe?g|webp)$/i,
          resourceQuery: { not: [/inline/] },
          type: 'asset/resource',
          include: /assets[\\/]images/,
          generator: {
            filename: 'assets/img/[name].[hash:8][ext]',
          },
        },

        {
          test: /\.(png|svg)$/i,
          type: 'asset',
          include: /assets[\\/]images/,
          exclude: /favicon/,
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024,
            },
          },
        },

        {
          test: /\.(svg)$/i,
          resourceQuery: /inline/,
          type: 'asset/inline',
        },
      ],
    },

    performance: {
      hints: isProd ? 'error' : 'warning',
      maxEntrypointSize: isProd ? 1024000 : 4096000,
      maxAssetSize: isProd ? 1024000 : 4096000,
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      open: true,
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
    },
  };
};