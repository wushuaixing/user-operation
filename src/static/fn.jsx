import { floatFormat } from '@/utils';
import WarningIcon from '@/assets/img/warn-icon.png';
import {
  AUCTION_STATUS, COLLATERAL_TYPE, HOUSE_TYPE, DOCUMENTFIND_STATUS,
  WSINATTACH_STATUS,
} from './index';

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
const handlePart = (params) => {
  const {
    ah, remark, buildingArea, collateral, houseType, landArea, priorityPrice, title, id, wsFindStatus, wsInAttach, wsUrl, status, isBack,
  } = params;
  const statusFn = (i = '') => (AUCTION_STATUS.slice(1).find((j) => j.value === i.toString()) || {}).label;
  const areaFn = (i = '') => (Number(i) <= 0 ? '-' : Number(i).toFixed(2));
  const list = wsFindStatus ? [{
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
  }] : [];
  return [
    {
      label: '基本信息',
      parentKey: 'basicInfo',
      width: '100%',
      list: [
        {
          lable: '标题', val: title || '-', key: 'title', id,
        },
        {
          lable: '拍卖状态', val: statusFn(status) || '-', key: 'status',
        },
        isBack && {
          lable: '退回备注', val: remark || '-', key: 'remark', color: '#f93535',
        },
      ].filter((i) => i),
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
        ...list,
      ].filter((i) => i),
    },
  ];
};
const ModalTitle = (props) => {
  const { title, text } = props;
  return <div className="yc-confirm-modal">
    <div className="yc-confirm-modal-title"><img src={WarningIcon} /><span>{title}</span></div>
    <div className="yc-confirm-modal-body" style="color: rgb(78, 85, 102);">{text}</div>
  </div>;
};

// 审核管理列表-拍卖信息
const auctionInfo = (pmStatus) => {
  // eslint-disable-next-line no-nested-ternary
  const obj = pmStatus === 1 ? { class: 'orange', label: '起拍价格' } : pmStatus === 5 ? { class: 'green', label: '成交价格' } : { class: '', label: '当前价格' };
  return [
    {
      lable: '处置机关',
      key: 'court',
      class: 'court',
    },
    {
      lable: '省份名称',
      key: 'province',
      class: 'province',
    },
    {
      lable: '开拍时间',
      key: 'start',
      class: 'start',
    },
    {
      lable: '评估价格',
      key: 'consultPrice',
      class: 'consultPrice',
    },
    {
      lable: '拍卖状态',
      key: 'pmStatus',
      class: obj.class,
    },
    {
      lable: obj.label,
      key: 'initialPrice',
      class: obj.class === 'green' ? 'red' : '',
    },
  ];
};

export {
  taskAssignTabs, handlePart, auditTabs, monitorTabs, ModalTitle, auctionInfo,
};
