export const normalRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/my-org'),
      },
      {
        path: '/dataAudit',
        name: 'dataAudit',
        component: () => import('@/views/data-audit/index.vue'),
      },
    ],
  },
  {
    path: '/documentSearch',
    name: 'documentSearch',
    component: () => import('@/views/document/serch/index.vue'),
  },
  {
    path: '/documentDetail/:wenshuId/:wid/:content',
    name: 'documentDetail',
    component: () => import('@/views/document/detail/index.vue'),
  },
];

export const adminRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/account-management/index.vue'),
      },
      {
        path: '/customerManagement/:id?',
        name: 'CustomerManagement',
        component: () => import('@/views/customer-management/index.vue'),
      },
      {
        path: '/taskAssign',
        name: 'TaskAssign',
        component: () => import('@/views/task-assign/index.vue'),
      },
    ],
  },
  {
    path: '/customerDetail/:id',
    name: 'customerDetail',
    component: () => import('@/views/customer-management/component/customer-detail.vue'),
  },
  {
    path: '/operationLog',
    name: 'OperationLog',
    component: () => import('@/views/customer-management/component/operation-log.vue'),
  },
  {
    path: '/operationRecord',
    name: 'OperationRecord',
    component: () => import('@/views/customer-management/component/operation-record.vue'),
  },
];

export const ruleProcess = (_this) => {
  const role = localStorage.getItem('role');
  const list = role === '204' ? normalRoutes : adminRoutes;
  list.forEach((i) => _this.$router.addRoute(i));
};

export const adminMenu = [
  {
    text: '账号管理',
    icon: 'iconfont iconyonghuyunying-zhanghaoguanli',
    path: '/index',
    key: 'Instructions',
    child: [
      {
        text: '运营账号',
        path: '/index',
        key: 'Instructions',
      },
    ],
  },
  {
    text: '客户管理',
    icon: 'iconfont iconyonghuyunying-kehuguanli',
    path: '/customerManagement',
    key: 'CustomerManagement',
  },
  {
    text: '顶级机构分配',
    icon: 'iconfont iconguquanchuantoutu',
    path: '/taskAssign',
    key: 'TaskAssign',
  },
];

export const userMenu = [
  {
    text: '我的机构',
    icon: 'el-icon-present',
    path: '/index',
    key: 'MyOrg',
  },
  {
    text: '审核管理',
    icon: 'el-icon-picture-outline-round',
    path: '/dataAudit',
    key: 'DataAudit',
  },
  {
    text: '文书搜索',
    icon: 'el-icon-present',
    path: '/documentSearch',
    key: 'DocumentSearch',
  },
];
