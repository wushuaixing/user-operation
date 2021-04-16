module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.18.255.8:8590/api", //代理接口
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", //代理的路径 //是否移除api三个字段
        },
      },
    },
  },
};
