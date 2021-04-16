import axios from "../index";
import { clearEmpty } from "@/utils";

const AdminApi = {
  //账号管理->结构化账号->账号列表

  getUsersList: (params) =>
    axios.post("/api/user/findUsers", clearEmpty(params)),

  //添加账号
  addUser: (params) => axios.post("/api/user/addUser", params),

  //删除账号 && 重置密码
  delUserAndResetPwd: (params, sign) => {
    let url =
      sign === "del" ? "/api/user/deleteUser" : "/api/user/resetPassword";
    return axios.post(url, params);
  },

  //获取标注人员列表
  simpleListUser: () => axios.get("/api/assetCheck/simpleListUser"),

  Degree: (params) => axios.post("/api/assetCheck/judge", params),
};

export default AdminApi;
