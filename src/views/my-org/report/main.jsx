import {
  reactive,
} from 'vue';

const main = () => {
  const shortcuts = [{
    text: '最近一天',
    value: (() => {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      return start;
    })(),
  }, {
    text: '最近一周',
    value: (() => {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return start;
    })(),
  }, {
    text: '最近一个月',
    value: (() => {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return start;
    })(),
  }];
  const reportFormOptions = {
    itemsChecked: [
      {
        title: '资产挖掘',
        key: 'zcwj',
        children: [
          {
            label: '资产拍卖',
            val: '1',
          },
          {
            label: '土地信息',
            val: '2,3,4',
          },
          {
            label: '无形资产',
            val: '5,6,7,8',
          },
          {
            label: '代位权',
            val: '9,10,11',
          },
          {
            label: '股权质押',
            val: '12',
          },
          {
            label: '动产抵押',
            val: '13',
          },
          {
            label: '查解封资产',
            val: '14',
          },
          {
            label: '在建工程',
            val: '15,16,17',
          },
          {
            label: '不动产登记',
            val: '18',
          },
          {
            label: '车辆信息',
            val: '19',
          },
          {
            label: '金融资产',
            val: '20,21,22',
          },
          {
            label: '招投标',
            val: '23',
          },
          {
            label: '电子报',
            val: '666',
          },
        ],
      },
      {
        title: '风险参考',
        key: 'fxck',
        children: [
          {
            label: '破案重组',
            val: '24',
          },
          {
            label: '被执行信息',
            val: '25',
          },
          {
            label: '终本案件',
            val: '26',
          },
          {
            label: '失信记录',
            val: '27',
          },
          {
            label: '限制高消费',
            val: '28',
          },
          {
            label: '涉诉信息',
            val: '29,30,31',
          },
          {
            label: '经营风险',
            val: '32,33,34,35,36,37',
          },
        ],
      },
    ],
  };
  const typeArr = {
    1: 'AUCTION',
    2: 'LAND_TRANSFER',
    3: 'LAND_TRANSACTION',
    4: 'LAND_MORTGAGE',
    5: 'INTANGIBLE_EMISSION',
    6: 'INTANGIBLE_MINING',
    7: 'INTANGIBLE_TRADEMARKRIGHT',
    8: 'INTANGIBLE_CONSTRUCT',
    9: 'TRIAL_SUBROGATION',
    10: 'COURT_SUBROGATION',
    11: 'JUDGMENT_SUBROGATION',
    12: 'PLEDGE',
    13: 'MORTGAGE',
    14: 'UNSEAL',
    15: 'ON_BUILD_PROJECT_INFO',
    16: 'ON_BUILD_PROJECT_BIDDING',
    17: 'ON_BUILD_CONSTRUCTION_LICENCE',
    18: 'ESTATE_REGISTER',
    19: 'VEHICLE_INFORMATION',
    20: 'FINANCE_AUCTIONBIDDING',
    21: 'FINANCE_INVESTMENT',
    22: 'FINANCE_FINANCE',
    23: 'BIDDING',
    24: 'BANKRUPTCY',
    25: 'RISK_EXECPERSON',
    26: 'RISK_EXEC_END_CASE',
    27: 'DISHONEST',
    28: 'LIMITHEIGHT',
    29: 'TRIAL_LAWSUIT',
    30: 'COURT_LAWSUIT',
    31: 'JUDGMENT_LAWSUIT',
    32: 'RISK_ABNORMAL',
    33: 'RISK_CHANGE',
    34: 'RISK_ILLEGAL',
    35: 'RISK_TAX',
    36: 'RISK_PUNISHMENT',
    37: 'RISK_EPB',
  };
  const rules = reactive({
    id: [
      { required: true, message: '请选择机构名称', trigger: 'change' },
    ],
    start: [
      {
        required: true,
        message: '请选择开始时间',
        trigger: 'change',
        type: 'date',
      },
    ],
    end: [
      {
        required: true,
        message: '请选择结束时间',
        trigger: 'change',
        type: 'date',
      },
    ],
    endTime: [
      {
        required: true,
        message: '请选择截止日期',
        trigger: 'change',
        type: 'date',
      },
    ],
  });
  const reportRules = reactive({
    id: [
      { required: true, message: '请选择机构名称', trigger: 'change' },
    ],
    start: [
      {
        required: true,
        message: '请选择开始时间',
        trigger: 'change',
        type: 'date',
      },
    ],
    end: [
      {
        required: true,
        message: '请选择结束时间',
        trigger: 'change',
        type: 'date',
      },
    ],
  });
  return {
    rules,
    shortcuts,
    reportFormOptions,
    typeArr,
    reportRules,
  };
};
export default main;
