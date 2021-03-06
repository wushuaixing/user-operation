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
        component: () => import('@/views/my-org/index.vue'),
      },
      {
        path: '/auditManagement/:id?',
        name: 'auditManagement',
        component: () => import('@/views/audit-management'),
      },
    ],
  },
  {
    path: '/documentSearch',
    name: 'documentSearch',
    component: () => import('@/views/document/serch/index.vue'),
  },
  {
    path: '/customerDetail/:id',
    name: 'customerDetail',
    component: () => import('@/views/customer-management/component/customer-detail.vue'),
  },
  {
    path: '/structureCheck/:auctionId',
    name: 'structureCheck',
    component: () => import('@/views/other-detail/check/index'),
  },
  {
    path: '/documentDetail',
    name: 'documentDetail',
    component: () => import('@/views/document/detail/index.vue'),
  },
  {
    path: '/monitorManage',
    name: 'monitorManage',
    component: () => import('@/views/my-org/monitor'),
  },
  {
    path: '/sourceWeb/:id',
    name: 'sourceWeb',
    component: () => import('@/views/source-web/source-web'),
  },
  {
    path: '/operationRecord',
    name: 'OperationRecord',
    component: () => import('@/views/customer-management/component/operation-record.vue'),
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
        path: '/accountManage',
        name: 'AccountManage',
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
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/work-bench/index'),
      },
      {
        path: '/monitoringView',
        name: 'monitoring-view',
        component: () => import('@/views/monitoring-view/index'),
      },
      {
        path: '/monitoringApi',
        name: 'monitoringApi',
        component: () => import('@/views/monitoring-api/index'),
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
    text: '?????????',
    icon: 'iconfont icongongzuotai',
    path: '/index',
    key: 'WorkBench',
  },
  {
    text: '????????????',
    icon: 'iconfont iconyonghuyunying-zhanghaoguanli',
    path: '/accountManage',
    key: 'Instructions',
    child: [
      {
        text: '????????????',
        path: '/accountManage',
        key: 'Instructions',
      },
    ],
  },
  {
    text: '????????????',
    icon: 'iconfont iconyonghuyunying-kehuguanli',
    path: '/customerManagement',
    key: 'CustomerManagement',
  },
  {
    text: '??????????????????',
    icon: 'iconfont icondingjijigoufenpei',
    path: '/taskAssign',
    key: 'TaskAssign',
  },
  {
    text: '??????????????????',
    icon: 'iconfont iconjiankongshitugailan',
    path: '/monitoringView',
    key: 'MonitoringView',
  },
  {
    text: 'API????????????',
    icon: 'iconfont iconAPIjiankongguanli',
    path: '/monitoringApi',
    key: 'MonitoringApi',
  },
];

export const userMenu = [
  {
    text: '????????????',
    icon: 'iconfont iconwodejigou',
    path: '/index',
    key: 'MyOrg',
  },
  {
    text: '????????????',
    icon: 'iconfont iconshenheguanli',
    path: '/auditManagement',
    key: 'AuditManagement',
  },
  {
    text: '????????????',
    icon: 'iconfont iconyonghuyunying-wenshusousuo',
    path: '/documentSearch',
    key: 'documentSearch',
  },
  // {
  //   text: '?????????????????????',
  //   icon: 'el-icon-present',
  //   path: '/structureCheck',
  //   key: 'structureCheck',
  // },
];
