import {
  reactive,
} from 'vue';

const main = () => {
  const shortcuts = [{
    text: '最近一天',
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      return [start, end];
    })(),
  }, {
    text: '最近一周',
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    })(),
  }, {
    text: '最近一个月',
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
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
  return {
    rules,
    shortcuts,
    reportFormOptions,
  };
};
export default main;
