export const normalRoutes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home"),
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("@/views/data-audit"),
      },
    ],
  },
  {
    path: "/documentSearch",
    name: "documentSearch",
    component: () => import("@/views/document-search/index"),
  },
  {
    path: "/documentDetail/:wenshuId/:wid/:content",
    name: "documentDetail",
    component: () => import("@/views/document-detail/index"),
  },
];

export const adminRoutes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home"),
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("@/views/account-management"),
      },
      {
        path: "/customerManagement/:customerName?/:id?",
        name: "CustomerManagement",
        component: () => import("@/views/customer-management"),
      },
      {
        path: "/taskAssign",
        name: "TaskAssign",
        component: () => import("@/views/task-assign"),
      },
    ],
  },
  {
    path: "/customerDetail/:id",
    name: "customerDetail",
    component: () => import("@/views/customer-management/component/CustomerDetail"),
  }
];

export const ruleProcess = (_this) => {
  const role = localStorage.getItem("role");
  const list = role === "204" ? normalRoutes : adminRoutes;
  list.forEach((i) => _this.$router.addRoute(i));
};

export const adminMenu = [
  {
    text: "账号管理",
    icon: "iconfont iconyonghuyunying-zhanghaoguanli",
    path: "/index",
    key: "Instructions",
    child: [
      {
        text: "运营账号",
        path: "/index",
        key: "Instructions",
      },
    ],
  },
  {
    text: "客户管理",
    icon: "iconfont iconyonghuyunying-kehuguanli",
    path: "/customerManagement",
    key: "CustomerManagement",
  },
  {
    text: "顶级机构分配",
    icon: "iconfont iconyonghuyunying-shenherenwufenpei",
    path: "/taskAssign",
    key: "TaskAssign",
  },
];

export const userMenu = [
  {
    text: "数据审核",
    icon: "el-icon-picture-outline-round",
    path: "/index",
    key: "DataAudit",
  },
  {
    text: "文书搜索",
    icon: "el-icon-present",
    path: "/documentSearch",
    key: "DocumentSearch",
  },
];

