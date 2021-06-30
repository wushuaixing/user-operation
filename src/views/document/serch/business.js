import { getCurrentInstance, reactive, toRaw } from 'vue';
import clearIcon from '@/assets/img/records_del.jpg';
import clearHoverIcon from '@/assets/img/records_del_hover.jpg';
import { clearEmpty } from '@/utils';
import CommonApi from '@/server/api/common';

const storage = window.localStorage;

const recordModule = (state, getTableList) => {
  const recordState = reactive({
    clearIcon,
    clearHoverIcon,
    recordsList: [],
    iconHover: false,
  });

  // 清空最近搜索
  const clearRecords = () => {
    storage.removeItem('records');
    recordState.iconHover = false;
    recordState.recordsList = [];
  };

  // 存储到本地
  const saveStorage = () => {
    const { content = '' } = state.params;
    const records = JSON.parse(storage.getItem('records')) || [];
    // eslint-disable-next-line no-unused-expressions
    content.trim() && records.unshift(content);
    const uniqueRecords = [...new Set(records)].slice(0, 10);
    storage.setItem('records', JSON.stringify(uniqueRecords));
    recordState.recordsList = uniqueRecords;
  };
  // 点击搜索
  const onSubmit = () => {
    const params = toRaw(state.params);
    const t = (str = '', flag) => (flag ? str.trim() : str.replace(/\s+/g, ' '));
    Object.keys(params).forEach(
      (key) => (params[key] = t(params[key], key !== 'content')),
    );
    state.params = {
      ...params,
    };
    state.queryOptions = {
      ...params,
    };
    state.page = 1;
    saveStorage();
    getTableList();
  };
  return {
    recordState, clearRecords, saveStorage, onSubmit,
  };
};

const mainModule = () => {
  const { proxy } = getCurrentInstance();
  const state = reactive({
    page: 1,
    params: {
      content: '',
      ah: '',
      court: '',
      url: '',
    },
    queryOptions: {},
    dataList: [],
    total: 0,
    loading: false,
  });
  const toDetail = (params = {}) => {
    const { wenshuId, wid } = params;
    const filterParams = toRaw(state.params);
    Object.keys(filterParams).forEach((i) => {
      filterParams[i] = filterParams[i].replace('%', '');
    });
    const routerData = proxy.$router.resolve({
      path: '/documentDetail',
      query: { wenshuId, wid, ...clearEmpty(filterParams) },
    });
    window.open(routerData.href, '_blank');
  };

  const getTableList = () => {
    const params = {
      ...(state.queryOptions),
      page: state.page,
    };
    state.loading = true;
    CommonApi.documentSearch(params)
      .then((res) => {
        const {
          data, code, page, total,
        } = res.data || {};
        if (code === 200) {
          state.total = total;
          state.page = page;
          state.dataList = data || [];
        } else {
          proxy.$message.error('请求出错');
        }
      })
      .finally(() => state.loading = false);
  };

  const resetForm = () => {
    proxy.$refs.queryForm.resetFields();
    state.queryOptions = {};
    state.page = 1;
    getTableList();
  };

  const pageChange = (page) => {
    state.page = parseInt(page, 10);
    getTableList();
  };
  // 点击最近搜索
  const handleFill = (content = '') => {
    const obj = {
      ...state.params,
      content,
    };
    state.params = obj;
    state.queryOptions = obj;
    state.page = 1;
    getTableList();
  };

  return {
    state,
    toDetail,
    getTableList,
    resetForm,
    pageChange,
    handleFill,
  };
};

export {
  recordModule,
  mainModule,
};
