import { clearEmpty, queryApi } from '@/utils';
import axios from '../index';

const CommonApi = {
  // 文书搜索
  documentSearch: (params = {}) => axios.get(`/api/user/judgment/search?${queryApi(params)}`),

  wenshuDetail: (id, wid, params) => axios.post(`/api/user/judgment/detail/${id}/${wid}`, clearEmpty(params)),

  htmlDetailInfo: (id) => axios.get(`/api/asset/auction/${id}/htmlDetailInfo`),
};

export default CommonApi;
