import axios from 'axios';

axios.processData = false;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 请求前拦截
axios.interceptors.request.use(
  (config) => {
    const dynamicConfig = config;
    const Authorization = window.localStorage.token !== undefined
      ? `Bearer ${window.localStorage.token}`
      : null;
    dynamicConfig.headers = {
      ...config.headers,
      ...(Authorization ? { Authorization } : {}),
    };
    return dynamicConfig;
  },
  (err) => {
    console.log('请求超时');
    return Promise.reject(err);
  },
);

// 返回后拦截
axios.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    // 根据后端提供的数据进行对应的处理
    if (code !== 200) {
      if (code === 401 || code === 5002 || code === 403) {
        window.location.href = '/login';
      } else {
        return response;
      }
    }
    // 成功请求到数据
    return response;
  },
  (err) => {
    console.log(err);
    if (err.response.status === 504 || err.response.status === 404) {
      console.log('请求出错');
    } else if (err.response.status === 401) {
      console.log('请重新登录');
    } else if (err.response.status === 500) {
      console.log('服务器遇到错误，无法完成请求');
    }
    return Promise.reject(err);
  },
);

const http = {
  post: (api, data, obj = {}) => axios.post(api, data, obj),
  get: (api, data) => axios.get(api, data),
};

/* =========  常规请求   ========= */
const service = axios.create({
  baseURL: '',
  timeout: 1000 * 30,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
export { service };
export default http;
