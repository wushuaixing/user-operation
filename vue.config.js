module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.18.255.8:8590/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
    open: true
  },
};
