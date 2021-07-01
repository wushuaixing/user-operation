import { getCurrentInstance, reactive, toRaw } from 'vue';

const queryModule = () => {
  const { proxy } = getCurrentInstance();
  const formState = reactive({
    approveTimeEnd: '', // 审核结束时间
    approveTimeStart: '', // 审核开始时间
    conSumerName: '', // 客户使用机构
    createTimeEnd: '', // 匹配结束时间
    createTimeStart: '', // 匹配开始时间
    important: '', // 匹配类型 0-模糊匹配、1-精确匹配
    num: 10, // 每页条数，默认20 ,示例值(20)
    obName: '', // 债务人
    obNumber: '', // 证件号
    orgId: '', // 机构id
    orgName: '', // 负责人/机构名称
    orgType: 1, // 机构类型 0 试用 1 正式
    page: 1, //
    parsingTitle: '', // 标题
    pmStatus: '', // 拍卖状态 1:'即将开始', 3:'进行中',5:'已成交',7:'已流拍',9:'中止',11:'撤回'
    sortColumn: '', // 排序字段,可用值:AUCTIONTIME,UPDATETIME
    sortOrder: '', // 排序顺序,可用值:ASC,DESC
    startEnd: '', // 开拍开始时间 ,示例值(2021-01-01)
    startStart: '', // 开拍开始时间 ,示例值(2021-01-01)
    status: '', // 状态 0未推送 1已推送 5不推送 2已召回 3已退回 4已修改
    tableType: '1', // 查询列表标签 1:结构化匹配 2:已推送 3:不推送 4:客户未读 5:召回
    updateTimeEnd: '', // 更新结束时间 ,示例值(2021-01-01)
    updateTimeStart: '', // 更新开始时间 ,示例值(2021-01-01)
    isOpen: false,
  });
  const onSerch = () => {
    console.log(toRaw(formState));
  };
  const resetForm = () => {
    proxy.$refs.queryForm.resetFields();
  };
  return { formState, onSerch, resetForm };
};
export default queryModule;
