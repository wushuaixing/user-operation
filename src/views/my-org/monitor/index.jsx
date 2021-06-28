import {
  defineComponent, getCurrentInstance, ref, reactive,
} from 'vue';
import { monitorTabs } from '@/static/fn';
import { dateUtils } from '@/utils';
import MyOrgApi from '@/server/api/my-org';
import Tree from './tree/tree';
import Query from './query/query';
import Table from './table/table';
import './style.scss';

export default defineComponent({
  components: {
    Tree,
    Query,
    Table,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    // 处理浏览器标签页标题 以及orgId
    const { name, id } = proxy.$root.$route.query;
    const headerTitle = `${name}-监控管理`;
    document.title = `【监控管理】${name}`;
    const idData = reactive({
      orgId: id,
      activeId: id,
    });

    // tab切换
    const tabKey = ref('1');
    const unReadNum = ref(0);
    const getTabNum = (ID) => {
      const params = {
        orgId: ID,
      };
      MyOrgApi.readNot(params).then((res) => {
        const { code, message, data = 0 } = res.data;
        if (code === 200) {
          // 赋值未读数量
          unReadNum.value = data;
        } else {
          proxy.$message.error(message);
        }
      });
    };

    const tableData = reactive({
      data: [],
      loading: false,
      page: 1,
      total: 0,
      num: 10,
    });

    const setParams = () => {
      const { state } = proxy.$refs.monitorQuery;
      let params = Object.assign(state, { orgId: idData.activeId, type: tabKey });
      if (params.approveTimeEnd) params.approveTimeEnd = dateUtils.formatStandardDate(params.approveTimeEnd);
      if (params.approveTimeStart) params.approveTimeStart = dateUtils.formatStandardDate(params.approveTimeStart);
      if (params.createTimeStart) params.createTimeStart = dateUtils.formatStandardDate(params.createTimeStart);
      if (params.createTimeEnd) params.createTimeEnd = dateUtils.formatStandardDate(params.createTimeEnd);
      if (params.updateTimeStart) params.updateTimeStart = dateUtils.formatStandardDate(params.updateTimeStart);
      if (params.updateTimeEnd) params.updateTimeEnd = dateUtils.formatStandardDate(params.updateTimeEnd);
      if (params.start) {
        const time = {
          startStart: dateUtils.formatStandardDate(params.start[0]),
          startEnd: dateUtils.formatStandardDate(params.start[1]),
        };
        params = Object.assign(params, time);
      }
      return params;
    };

    const getList = () => {
      tableData.loading = true;
      const params = setParams();
      MyOrgApi.monitorList(params).then((res) => {
        const { code, data = {} } = res.data;
        if (code === 200) {
          const { list = [] } = data;
          tableData.data = list;
        }
        tableData.loading = false;
        getTabNum(idData.activeId);
      });
    };
    // 树节点点击  搜索
    const treeNodeClick = (ID) => {
      // 根据节点id进行搜索，清空搜索条件
      idData.activeId = ID;
      const { resetSearch } = proxy.$refs.monitorQuery;
      resetSearch();
    };
    const tabChange = (val) => {
      // val.props.name
      tabKey.value = val.props.name;
      getList();
    };
    // 搜索 清空搜索条件
    const resetSearch = () => {
      getList();
    };
    const handleSearch = () => {
      getList();
    };

    const handleExport = () => {
      // 将筛选条件传入
      const { exportAction } = proxy.$refs.Table;
      const params = setParams();
      exportAction(params);
    };

    return {
      headerTitle,
      idData,
      unReadNum,
      tabKey,
      tabChange,
      treeNodeClick,
      tableData,
      resetSearch,
      handleSearch,
      handleExport,
    };
  },
  render() {
    const {
      headerTitle, idData, tabKey, tabChange, unReadNum, treeNodeClick, tableData, handleSearch, resetSearch, handleExport,
    } = this;

    return (
      <div className="yc-newpage-contaner">
        <div className="monitor-manage">
          <div className="monitor-manage-header">
            <span className="header-title">
              {headerTitle}
            </span>
            <span className="data-type">
              <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
                <use xlink:href="#iconshujuleixing"/>
              </svg>
              <span className="middle">当前数据类型：</span>
              <span className="right">资产拍卖</span>
            </span>
          </div>
          <div className="monitor-manage-body">
            <div className="left-tree">
              <Tree
                orgId={idData.orgId}
                onTreeNodeClick={treeNodeClick}
              />
            </div>
            <div className="query-data">
              <div className="query-area">
                <Query ref="monitorQuery" onHandleSearch={handleSearch} onResetSearch={resetSearch}/>
              </div>
              <div className="data-area">
                <div>
                  <el-tabs v-model={tabKey} onTabClick={tabChange} class="monitor-tabs">
                    { monitorTabs(unReadNum).map((item) => (
                      <el-tab-pane
                        key={item.value}
                        label={item.label}
                        name={item.value}
                      />
                    )) }
                  </el-tabs>
                </div>
                <Table tableData={tableData} onExport={handleExport} ref="Table"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
