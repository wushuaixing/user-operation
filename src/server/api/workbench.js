import axios from '../index';

const workbenchApi = {
  getStatistics: () => axios.get('/api/admin/platform/statistics'),
  export: (date, type) => axios.get(`/api/admin/platform/export?date=${date}&type=${type}`),
  getList: (params) => axios.post('/api/admin/platform/list', params),
};
export default workbenchApi;
