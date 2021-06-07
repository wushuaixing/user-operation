import { queryApi } from '@/utils';
import axios from '../index';

const CommonApi = {
  // 文书搜索
  documentSearch: (params = {}) => axios.get(`/api/asset/wenshu/search?${queryApi(params)}`),

  wenshuDetail: (id, wid, params) => axios.post(`/api/asset/wenshu/detail/${id}/${wid}`, params),

  htmlDetailInfo: (id) => axios.get(`/api/asset/auction/${id}/htmlDetailInfo`),
};

export default CommonApi;
