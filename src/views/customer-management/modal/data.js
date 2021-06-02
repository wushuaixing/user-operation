const rulesFormOptions = {
  options: {
    labelPosition: "right",
    labelWidth: "180px",
    destroyOnClose: true,
    class: "rules-modal",
  },
  rules: {
    name: {
      required: true,
      message: "顶级合作机构名称不允许为空",
      trigger: "blur",
    },
    type: {
      required: true,
      message: "请选择机构类型",
      trigger: "change",
    },
    contractType: {
      required: true,
      message: "请选择延期或续签",
      trigger: "change",
    },
    end: {
      required: true,
      message: "合同结束日期不允许为空",
      trigger: "blur",
    },
    parentId: {
      required: true,
      message: "请选择上级机构ID",
      trigger: "change",
    },
    parentName: {
      required: true,
      message: "上级机构名称不允许为空",
      trigger: "change",
    },
    isPortraitLimit: {
      required: true,
      message: "请选择限制画像查询次数",
      trigger: "change",
    },
    isClassifiedLimit: {
      required: true,
      message: "请选择限制分类搜索次数",
      trigger: "change",
    },
    isObligorLimit: {
      required: true,
      message: "请选择限制监控债务人数",
      trigger: "change",
    },
    isSubOrgLimit: {
      required: true,
      message: "请选择限制配置子机构数",
      trigger: "change",
    },
    isAccountLimit: {
      required: true,
      message: "请选择限制配置账号数",
      trigger: "change",
    },
    portraitLimitCount: {
      required: true,
      message: "请输入上限",
      trigger: "blur",
    },
    obligorLimitCount: {
      required: true,
      message: "请输入上限",
      trigger: "blur",
    },
    subOrgLimitCount: {
      required: true,
      message: "请输入上限",
      trigger: "blur",
    },
    accountLimitCount: {
      required: true,
      message: "请输入上限",
      trigger: "blur",
    },
  },
  itemsRaido: [
    {
      label: "限制画像查询次数",
      val: "isPortraitLimit",
      num: "portraitLimitCount",
      limit: "",
    },
    {
      label: "限制分类搜索次数",
      val: "isClassifiedLimit",
      num: "classifiedLimitCount",
      limit: "",
    },
    {
      label: "限制监控债务人数",
      val: "isObligorLimit",
      num: "obligorLimitCount",
      limit: "obligorUseCount",
    },
    {
      label: "限制配置子机构数",
      val: "isSubOrgLimit",
      num: "subOrgLimitCount",
      limit: "subOrgUseCount",
    },
    {
      label: "限制配置账号数",
      val: "isAccountLimit",
      num: "accountLimitCount",
      limit: "accountUseCount",
    },
  ],
  itemsChecked: [
    {
      title: "资产挖掘",
      key: "zcwj",
      children: [
        {
          label: "资产拍卖",
          val: "2",
        },
        {
          label: "土地数据",
          val: "29",
        },
        {
          label: "招标中标",
          val: "30",
        },
        {
          label: "代位权",
          val: "4",
        },
        {
          label: "金融资产",
          val: "31",
        },
        {
          label: "动产抵押",
          val: "32",
        },
        {
          label: "无形资产",
          val: "41",
        },
        {
          label: "查解封资产",
          val: "49",
        },
        {
          label: "股权质押",
          val: "44",
        },
        {
          label: "车辆信息",
          val: "52",
        },
        {
          label: "不动产登记",
          val: "51",
        },
      ],
    },
    {
      title: "资产挖掘-在建工程",
      key: "zjgc",
      children: [
        {
          label: "建设单位",
          val: "54",
        },
        {
          label: "中标单位",
          val: "55",
        },
        {
          label: "施工单位",
          val: "56",
        },
      ],
    },
    {
      title: "风险监控",
      key: "fxjk",
      children: [
        {
          label: "涉诉监控",
          val: "39",
        },
        {
          label: "失信记录",
          val: "42",
        },
        {
          label: "企业破产重组",
          val: "40",
        },
        {
          label: "限制高消费",
          val: "50",
        },
      ],
    },
    {
      title: "风险监控-经营风险",
      key: "jyfx",
      children: [
        {
          label: "经营异常",
          val: "33",
        },
        {
          label: "工商变更",
          val: "34",
        },
        {
          label: "严重违法",
          val: "35",
        },
        {
          label: "环保处罚",
          val: "38",
        },
        {
          label: "税收违法",
          val: "36",
        },
        {
          label: "行政处罚",
          val: "37",
        },
      ],
    },
    {
      title: "业务管理",
      key: "ywgl",
      children: [
        {
          label: "业务视图",
          val: "6",
        },
        {
          label: "债务人",
          val: "7",
        },
      ],
    },
    {
      title: "画像搜索",
      key: "hxss",
      children: [
        {
          label: "画像搜索",
          val: "27",
        },
      ],
    },
    {
      title: "信息搜索",
      key: "xxss",
      children: [
        {
          label: "拍卖信息",
          val: "12",
        },
        {
          label: "涉诉信息",
          val: "13",
        },
        {
          label: "文书信息",
          val: "18",
        },
        {
          label: "金融资产",
          val: "25",
        },
        {
          label: "破产重组",
          val: "28",
        },
        {
          label: "失信记录",
          val: "45",
        },
        {
          label: "土地数据",
          val: "46",
        },
        {
          label: "股权质押",
          val: "47",
        },
        {
          label: "动产抵押",
          val: "48",
        },
      ],
    },
    {
      title: "机构管理",
      key: "jggl",
      children: [
        {
          label: "推送设置",
          val: "10",
        },
        {
          label: "账号列表",
          val: "11",
        },
        {
          label: "机构统计",
          val: "43",
        },
      ],
    },
    {
      title: "代理机构",
      key: "dljg",
      children: [
        {
          label: "代理机构",
          val: "35",
        },
      ],
    },
  ],
};
const rulesForm = {
  id: "",
  name: "",
  type: 1, //机构类型
  contractType: 1, // 签约类型
  start: undefined, //合同起始日期
  end: undefined, //合同结束日期
  parentId: "", // 上级机构id
  parentName: "", // 上级机构名称
  /*----*/
  isPortraitLimit: 0, //是否限制画像查询次数
  isClassifiedLimit: 0, //是否限制分类搜索次数
  isObligorLimit: 0, //是否限制监控债务人数
  isSubOrgLimit: 0, //是否限制配置子机构数
  isAccountLimit: 0, //是否限制配置账号数
  /*----*/
  portraitLimitCount: 0, //限制的画像查询次数
  classifiedLimitCount: 0, //限制的分类搜索次数
  obligorLimitCount: 0, //限制的监控债务人数
  subOrgLimitCount: 0, //限制的配置子机构数
  accountLimitCount: 0, //限制的配置账号数
  /*----*/
  obligorUseCount: 0, //已使用监控债务人数
  subOrgUseCount: 0, //已使用子机构数
  accountUseCount: 0, //已使用账号数
};
const checkList = {
  zcwj: {
    checkAll: true,
    checkedData: [
      "2",
      "29",
      "30",
      "4",
      "31",
      "32",
      "41",
      "49",
      "44",
      "52",
      "51",
    ],
    isIndeterminate: false,
    options: ["2", "29", "30", "4", "31", "32", "41", "49", "44", "52", "51"],
  },
  zjgc: {
    checkAll: true,
    checkedData: ["54", "55", "56"],
    isIndeterminate: false,
    options: ["54", "55", "56"],
  },
  fxjk: {
    checkAll: true,
    checkedData: ["39", "42", "40", "50"],
    isIndeterminate: false,
    options: ["39", "42", "40", "50"],
  },
  jyfx: {
    checkAll: true,
    checkedData: ["33", "34", "35", "38", "36", "37"],
    isIndeterminate: false,
    options: ["33", "34", "35", "38", "36", "37"],
  },
  ywgl: {
    checkAll: true,
    checkedData: ["6", "7"],
    isIndeterminate: false,
    options: ["6", "7"],
  },
  hxss: {
    checkAll: true,
    checkedData: ["27"],
    isIndeterminate: false,
    options: ["27"],
  },
  xxss: {
    checkAll: true,
    checkedData: ["12", "13", "18", "25", "28", "45", "46", "47", "48"],
    isIndeterminate: false,
    options: ["12", "13", "18", "25", "28", "45", "46", "47", "48"],
  },
  jggl: {
    checkAll: true,
    checkedData: ["10", "11", "43"],
    isIndeterminate: false,
    options: ["10", "11", "43"],
  },
  dljg: {
    checkAll: false,
    checkedData: [],
    isIndeterminate: false,
    options: ["35"],
  },
};

export { rulesFormOptions, rulesForm, checkList };
