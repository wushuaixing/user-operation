const rulesFormOptions = {
  options: {
    labelPosition: 'right',
    labelWidth: '166px',
    destroyOnClose: true,
    class: 'rules-modal-form',
  },
  rules: {
    name: {
      required: true,
      message: '机构名称不允许为空',
      trigger: 'change',
    },
    type: {
      required: true,
      message: '请选择机构类型',
      trigger: 'change',
    },
    contractType: {
      required: true,
      message: '请选择延期或续签',
      trigger: 'change',
    },
    end: {
      required: true,
      message: '合同结束日期不允许为空',
      trigger: 'change',
    },
    parentId: {
      required: true,
      message: '请选择上级机构ID',
      trigger: 'change',
    },
    isPortraitLimit: {
      required: true,
      message: '请选择限制画像查询次数',
      trigger: 'change',
    },
    isClassifiedLimit: {
      required: true,
      message: '请选择限制分类搜索次数',
      trigger: 'change',
    },
    isObligorLimit: {
      required: true,
      message: '请选择限制监控债务人数',
      trigger: 'change',
    },
    isSubOrgLimit: {
      required: true,
      message: '请选择限制配置子机构数',
      trigger: 'change',
    },
    isAccountLimit: {
      required: true,
      message: '请选择限制配置账号数',
      trigger: 'change',
    },
    portraitLimitCount: {
      required: true,
      message: '请输入上限',
      trigger: 'blur',
    },
    obligorLimitCount: {
      required: true,
      message: '请输入上限',
      trigger: 'blur',
    },
    subOrgLimitCount: {
      required: true,
      message: '请输入上限',
      trigger: 'blur',
    },
    accountLimitCount: {
      required: true,
      message: '请输入上限',
      trigger: 'blur',
    },
  },
  itemsRaido: [
    {
      label: '限制画像查询次数',
      val: 'isPortraitLimit',
      num: 'portraitLimitCount',
      limit: '',
    },
    {
      label: '限制分类搜索次数',
      val: 'isClassifiedLimit',
      num: 'classifiedLimitCount',
      limit: '',
    },
    {
      label: '限制监控债务人数',
      val: 'isObligorLimit',
      num: 'obligorLimitCount',
      limit: 'obligorUseCount',
    },
    {
      label: '限制配置子机构数',
      val: 'isSubOrgLimit',
      num: 'subOrgLimitCount',
      limit: 'subOrgUseCount',
    },
    {
      label: '限制配置账号数',
      val: 'isAccountLimit',
      num: 'accountLimitCount',
      limit: 'accountUseCount',
    },
  ],
};
const rulesForm = {
  id: '',
  name: '',
  type: 1, // 机构类型
  contractType: 0, // 签约类型
  start: undefined, // 合同起始日期
  end: undefined, // 合同结束日期
  parentId: '', // 上级机构id
  parentName: '', // 上级机构名称
  /*----*/
  isPortraitLimit: 0, // 是否限制画像查询次数
  isClassifiedLimit: 0, // 是否限制分类搜索次数
  isObligorLimit: 0, // 是否限制监控债务人数
  isSubOrgLimit: 0, // 是否限制配置子机构数
  isAccountLimit: 0, // 是否限制配置账号数
  /*----*/
  portraitLimitCount: 0, // 限制的画像查询次数
  classifiedLimitCount: 0, // 限制的分类搜索次数
  obligorLimitCount: 0, // 限制的监控债务人数
  subOrgLimitCount: 0, // 限制的配置子机构数
  accountLimitCount: 0, // 限制的配置账号数
  /*----*/
  obligorUseCount: 0, // 已使用监控债务人数
  subOrgUseCount: 0, // 已使用子机构数
  accountUseCount: 0, // 已使用账号数
};

export {
  rulesFormOptions, rulesForm,
};
