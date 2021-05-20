import axios from "../index";
import { clearEmpty, queryApi } from "@/utils";

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

  /*--------------------------账号管理----------------------*/
  //添加账号
  addAccount: (params) => axios.post("/admin/account/addAccount", params),

  //删除账号
  delAccount: (params) => axios.post("/admin/account/deleteAccount", params),

  //账号列表
  getAccountList: (params) =>
    axios.get(`/admin/account/list${queryApi(params)}`),

  //重置密码
  resetPassword: (params) => axios.post("/admin/account/resetPassword", params),

  /*--------------------------顶级机构分配----------------------*/
  //批量分配-重新分配
  distribute: (params) => axios.post("/distribution/distribute", params),

  //待分配顶级机构数量
  getNum: () => axios.get("/distribution/getNum"),

  //顶级机构分配列表
  distributeList: (type, params) =>
    axios.post(`/distribution/list/${type}`, clearEmpty(params)),

  //负责人列表
  simpleUserList: () => axios.get("/distribution/simpleUserList"),

  /*--------------------------客户管理----------------------*/
  //创建域名机构
  addDomain: (params) => axios.post("/admin/organization/addDomain", params),

  //导出
  orgExport: (params) =>
    axios.post("/admin/organization/export", clearEmpty(params)),

  //创建顶级合作机构
  addTopOrg: (params) => axios.post("/admin/organization/addTopOrg", params),

  //详情-顶级合作机构详情页
  orgDetail: (id) => axios.get(`/admin/organization/detail?id:${id}`),

  //详情-创建本级账号
  detailAddOrgUser: (params) =>
    axios.post("/admin/organization/detail/addOrgUser", params),

  //详情-创建子机构
  detailAddSubOrg: (params) =>
    axios.post("/admin/organization/detail/addSubOrg", params),

  //详情-客户使用机构名称修改
  detailEditName: (params) =>
    axios.post("/admin/organization/detail/changeName", params),

  //详情-编辑本级账号
  detailEditOrgUser: (params) =>
    axios.post("/admin/organization/detail/changeOrgUser", params),

  //详情-编辑子机构
  detailChangeSubOrg: (params) =>
    axios.post("/admin/organization/detail/changeSubOrg", params),

  //详情-删除本级账号
  detailDelOrgUser: (params) =>
    axios.post("/admin/organization/detail/deleteOrgUser", params),

  //详情-删除子机构
  detailDelSubOrg: (params) =>
    axios.post("/admin/organization/detail/deleteSubOrg", params),

  //详情-机构用户操作记录
  detailOrgUserLog: (params) =>
    axios.post("/admin/organization/detail/orgUserLog", clearEmpty(params)),

  //详情-重置密码
  detailResetPwd: (params) =>
    axios.post("/admin/organization/detail/resetPassword", params),

  //详情-本级账号-角色查询
  getSimpleListRole: () =>
    axios.get("/admin/organization/detail/simpleListRole"),

  //详情-客户使用机构详情
  detailSubOrg: (id) => axios.get(`/admin/organization/detail/subOrg?id=${id}`),

  //域名机构列表
  orgListDomain: () => axios.get("/admin/organization/listDomain"),

  //操作日志
  orgListOrgLog: (params) =>
    axios.post("/admin/organization/listOrgLog", clearEmpty(params)),

  //机构权限查询
  orgPermission: (id) => axios.get(`/admin/organization/permission?id=${id}`),

  //权限修改保存
  orgSavePermission: (params) =>
    axios.post("/admin/organization/savePermission", clearEmpty(params)),

  //搜索
  searchOrg: (params) =>
    axios.post("/admin/organization/searchOrg", clearEmpty(params)),

  //可选的上级机构列表
  selectParentOrgList: (id) =>
    axios.get(`/admin/organization/selectParentOrg?id=${id}`),

  //机构名称模糊查询
  simpleListOrg: (key) =>
    axios.get(`/admin/organization/simpleListOrg?id=${key}`),
};

export default AdminApi;
