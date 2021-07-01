import { clearEmpty, queryApi } from '@/utils';
import axios from '../index';

/* --------------------------我的机构----------------------*/
const MyOrgApi = {
  // 我的机构列表
  myOrgList: (params) => axios.post('/api/user/operate/getMyOrgDetail', clearEmpty(params)),
  // 未读数量
  readNot: (params) => axios.get(`/api/user/operate/countReadNot?${queryApi(params)}`),
  // 导出
  export: (params) => axios.post('/api/user/operate/export', clearEmpty(params), { responseType: 'blob' }),
  // 监控管理列表
  monitorList: (params) => axios.post('/api/user/operate/getMonitorList', clearEmpty(params)),
  // 监控管理导出
  auditExport: (params) => axios.post('/api/user/operate/auditExport', clearEmpty(params), { responseType: 'blob' }),
  // 客户报告
  exportOther: (params) => axios.post('/api/user/operate/exportOther', clearEmpty(params), { responseType: 'blob' }),
  // 客户使用机构列表
  orgTree: (params) => axios.get(`/api/user/operate/orgTree?${queryApi(params)}`),
  // 原网站提取页
  htmlDetail: (id) => axios.get(`/api/user/structured/${id}/htmlDetailInfo`),
  // 获取相似附件
  getSimilarFile: (id) => axios.get(`/api/user/structured/getSimilarFile/${id}`),
};

export default MyOrgApi;
