module.exports = {
  lintOnSave: false,

  pwa: {
    name: '2048'
  },

  devServer: {
    // host: '0.0.0.0',
    port: 2048,
    disableHostCheck:true,
    public: '112.126.97.26:2048',
  },

  // publicPath: './'
}