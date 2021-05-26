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
  const list = role === "Admin" ? adminRoutes : normalRoutes;
  list.forEach((i) => _this.$router.addRoute(i));
};
