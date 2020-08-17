const webpack = require('webpack')
module.exports = {
  lintOnSave: false,
  baseUrl: './',
  configureWebpack: {

    plugins: [

      new webpack.ProvidePlugin({

        $: 'jquery',

        jQuery: 'jquery',

        'windows.jQuery': 'jquery'

      })

    ]
  }
}
