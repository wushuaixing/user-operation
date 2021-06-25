import { floatFormat } from '@/utils';
import {
  AUCTION_STATUS, COLLATERAL_TYPE, HOUSE_TYPE, DOCUMENTFIND_STATUS,
  WSINATTACH_STATUS,
} from './index';

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

const auditTabs = (readNotNum, recallNum) => [

  {
    label: '结构化匹配',
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
    label: `客户未读(${readNotNum})`,
    name: '4',
  },
  {
    label: `召回(${recallNum})`,
    name: '5',
  },
];

const monitorTabs = (unReadNum) => [
  {
    label: '已推送',
    value: '1',
  },
  {
    label: `客户未读(${unReadNum})`,
    value: '0',
  },
];

// 结构化校验-详情
const partData = (params) => {
  const {
    ah, remark, buildingArea, collateral, houseType, landArea, priorityPrice, title, url, wsFindStatus, wsInAttach, wsUrl, status,
  } = params;
  const statusFn = (i = '') => (AUCTION_STATUS.slice(1).find((j) => j.value === i.toString()) || {}).label;
  const areaFn = (i = '') => (!Number(i) ? '-' : Number(i).toFixed(2));
  return [
    {
      label: '基本信息',
      parentKey: 'basicInfo',
      width: '100%',
      list: [
        {
          lable: '标题', val: title || '-', key: 'title', url,
        },
        {
          lable: '拍卖状态', val: statusFn(status) || '-', key: 'status',
        },
        {
          lable: '退回备注', val: remark || '-', key: 'remark', color: '#f93535',
        },
      ],
    },
    {
      label: '房产/土地信息',
      parentKey: 'PropertyInfo',
      width: '38.25%',
      list: [
        {
          lable: '抵押情况', val: COLLATERAL_TYPE[collateral] || '-', key: 'collateral',
        },
        {
          lable: '房产/土地类型', val: HOUSE_TYPE[houseType] || '-', key: 'houseType',
        },
        {
          lable: '建筑面积', val: areaFn(buildingArea), key: 'buildingArea',
        },
        {
          lable: '土地面积', val: areaFn(landArea), key: 'landArea',
        },
      ],
    },
    {
      label: '文书信息',
      parentKey: 'documentInfo',
      width: '61.75%',
      list: [
        {
          lable: '查找情况', val: DOCUMENTFIND_STATUS[wsFindStatus] || '-', key: 'wsFindStatus',
        },
        {
          lable: '相关文书案号', val: ah || [], key: 'ah',
        },
        {
          lable: '文书链接地址', val: wsUrl || [], key: 'wsUrl',
        },
        {
          lable: '见附件情况', val: WSINATTACH_STATUS[wsInAttach], key: 'wsInAttach',
        },
        {
          lable: '优先受偿额', val: floatFormat(priorityPrice), key: 'priorityPrice',
        },
      ],
    },
  ];
};
export {
  dataAuditTabs, taskAssignTabs, partData, auditTabs, monitorTabs,
};
