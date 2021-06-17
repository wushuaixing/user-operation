// 排序字段&&方式 对应
const SORTER_TYPE = {
  obligorNum: 'OBLIGOR_NUM',
  orgNum: 'ORG_NUM',
  ascending: 'ASC',
  descending: 'DESC',
};

// 顶级机构列表排序
const CUSTOMER_LIST = {
  startTime: 'START',
  endTime: 'END',
  ascending: 'ASC',
  descending: 'DESC',
};

// 拍卖状态
const AUCTION_STATUS = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '即将开始',
  },
  {
    value: '3',
    label: '进行中',
  },
  {
    value: '5',
    label: '已成交',
  },
  {
    value: '7',
    label: '已流拍',
  },
  {
    value: '9',
    label: '中止',
  },
  {
    value: '11',
    label: '撤回',
  },
];

const DEBTORES_TYPE = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '企业',
  },
  {
    value: '2',
    label: '个人',
  },
];

const ACTION_TYPE = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '已推送',
  },
  {
    value: '2',
    label: '不推送',
  },
  {
    value: '3',
    label: '已退回',
  },
  {
    value: '4',
    label: '已修改',
  },
  {
    value: '5',
    label: '已召回',
  },
];

const TOP_ORG_STATUS = {
  0: '全部',
  1: '合作中',
  2: '已过期',
  3: '即将过期（两月内）',
  4: '已过期（两月内）',
};

// 机构类型 TODO eslint
const orgType = [
  {
    label: '全部',
    value: -1,
  },
  {
    label: '正式',
    value: 1,
  },
  {
    label: '试用',
    value: 0,
  },
];

// 操作日志-操作模块
const OPERA_MODULE_LIST = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '创建顶级合作机构',
    value: 1,
  },
  {
    label: '编辑机构名称',
    value: 2,
  },
  {
    label: '修改机构类型',
    value: 3,
  },
  {
    label: '修改合同起止日期',
    value: 4,
  },
  {
    label: '修改上级机构ID',
    value: 5,
  },
  {
    label: '修改画像查询次数',
    value: 6,
  },
  {
    label: '修改分类搜索次数',
    value: 7,
  },
  {
    label: '修改监控债务人数',
    value: 8,
  },
  {
    label: '修改配置子机构数',
    value: 9,
  },
  {
    label: '修改配置账号数',
    value: 10,
  },
  {
    label: '修改资产监控权限',
    value: 11,
  },
];

// 客户详情 -操作记录
const OPERATION_TYPE = {
  0: '全部',
  1: '登录',
  2: '退出登录',
  3: '导入债务人',
  4: '删除业务',
  5: '开启推送',
  6: '关闭推送',
};

export {
  SORTER_TYPE,
  CUSTOMER_LIST,
  AUCTION_STATUS,
  DEBTORES_TYPE,
  ACTION_TYPE,
  TOP_ORG_STATUS,
  orgType,
  OPERA_MODULE_LIST,
  OPERATION_TYPE,
};
