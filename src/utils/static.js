//排序字段&&方式 对应
const SORTER_TYPE = {
  normalErrorNum: "NORMAL_ERROR_RATE",
  notIncludeErrorNum: "NOT_INCLUDE_ERROR_RATE",
  ascending: "ASC",
  descending: "DESC",
};

//拍卖状态
const AUCTION_STATUS = [
  {
    value: "",
    label: "全部",
  },
  {
    value: "1",
    label: "即将开始",
  },
  {
    value: "3",
    label: "进行中",
  },
  {
    value: "5",
    label: "已成交",
  },
  {
    value: "7",
    label: "已流拍",
  },
  {
    value: "9",
    label: "中止",
  },
  {
    value: "11",
    label: "撤回",
  },
];

const DEBTORES_TYPE = [
  {
    value: "",
    label: "全部",
  },
  {
    value: "1",
    label: "企业",
  },
  {
    value: "2",
    label: "个人",
  },
];

const ACTION_TYPE = [
  {
    value: "",
    label: "全部",
  },
  {
    value: "1",
    label: "已推送",
  },
  {
    value: "2",
    label: "不推送",
  },
  {
    value: "3",
    label: "已退回",
  },
  {
    value: "4",
    label: "已修改",
  },
  {
    value: "5",
    label: "已召回",
  },
];

const dataAuditTabs = (matchNum, noReadNum) => [
  {
    label: `结构化匹配(${matchNum})`,
    name: "0",
  },
  {
    label: "全文匹配",
    name: "1",
  },
  {
    label: "已推送",
    name: "2",
  },
  {
    label: "不推送",
    name: "3",
  },
  {
    label: `客户未读(${noReadNum})`,
    name: "4",
  },
];

const taskAssignTabs = (toBeAllocatedNum) => [
  {
    label: `待分配机构(${toBeAllocatedNum})`,
    name: "0",
  },
  {
    label: "已分配机构",
    name: "1",
  },
];

export {
  SORTER_TYPE,
  AUCTION_STATUS,
  DEBTORES_TYPE,
  ACTION_TYPE,
  dataAuditTabs,
  taskAssignTabs,
};