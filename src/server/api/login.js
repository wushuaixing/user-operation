import axios from "../index";
const LoginApi = {
  login: (params) => axios.post("/api/auth/login", params), //登录
  loginOut: () => axios.get("/api/auth/logout"), //退出登录
  preLogin: ({username}) => axios.get(`/api/auth/preLogin?phone=${username}`), //预登录检查账号状态
  getUserInfo: () => axios.get("/api/auth/getUserInfo"), //获取用户信息
  getCaptcha: (phone) => axios.get(`/api/auth/getCaptcha?phone=${phone}`), //获取图片验证码
  editPassword: (params) => axios.post("/api/auth/editPassword", params), //修改密码
};
export default LoginApi;
