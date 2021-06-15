const dataAuditTabs = (matchNum, noReadNum) => [
  {
    label: `结构化匹配(${matchNum})`,
    name: '0',
  },
  {
    label: '全文匹配',
    name: '1',
  },
  {
    label: '已推送',
    name: '2',
  },
  {
    label: '不推送',
    name: '3',
  },
  {
    label: `客户未读(${noReadNum})`,
    name: '4',
  },
];

const taskAssignTabs = (toBeAllocatedNum) => [
  {
    label: `待分配机构(${toBeAllocatedNum})`,
    name: '1',
  },
  {
    label: ' 已分配机构 ',
    name: '2',
  },
];
export {
  dataAuditTabs, taskAssignTabs,
};
