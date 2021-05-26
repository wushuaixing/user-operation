module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.18.255.8:38851/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
