import {
  defineComponent, reactive, onMounted, getCurrentInstance, toRaw, watch, nextTick,
} from 'vue';
import CommonApi from '@/server/api/common';
import { auditTabs } from '@/static/fn';
import { auditColumn } from '@/static/column';
import { selectSlots, timeLineSlots, tableEmptytSlots } from '@/static/slot';
import { dateUtils } from '@/utils/index';
import { MONITOR_LIST } from '@/static';
import NoOrgImg from '@/assets/img/no_org.png';
import columnHtml from './business/table';
import modalModule from './business/modal';
import Query from './view/query';
import './style.scss';

const option = [{ label: '正式', val: 1 }, { label: '试用', val: 0 }];

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      type: 1,
      allList: [],
      treeList: [],
      height: '72vh',
      tableList: [],
      page: 1,
      num: 10,
      total: 0,
      readNotNum: '0',
      recallNum: '0',
      loading: false,
    });
    const queryState = reactive({
      num: 10, // 每页条数，默认20 ,示例值(20)
      orgId: '', // 机构id
      page: 1, //
      sortColumn: '', // 排序字段,可用值:AUCTIONTIME,UPDATETIME
      sortOrder: '', // 排序顺序,可用值:ASC,DESC
      tableType: '1', // 查询列表标签 1:结构化匹配 2:已推送 3:不推送 4:客户未读 5:召回
    });

    const setTreeMinHeight = () => {
      state.height = '72vh';
      nextTick(() => {
        const dom = document.getElementById('content-right');
        if (dom && dom.clientHeight) {
          const height = dom.clientHeight > 834 ? `${dom.clientHeight}px` : '72vh';
          state.height = height;
        }
      }).then((r) => console.log(r));
    };

    const getParams = () => {
      const f = (i) => dateUtils.formatStandardDate(i);
      const {
        createTimeStart, createTimeEnd, approveTimeStart, approveTimeEnd, start, updateTimeEnd, updateTimeStart, ...rest
      } = proxy.$refs.queryRef.state;
      const obj = {
        createTimeStart, createTimeEnd, approveTimeStart, approveTimeEnd, updateTimeEnd, updateTimeStart, startStart: start[0], startEnd: start[1],
      };
      Object.keys(obj).forEach((i) => obj[i] = f(obj[i]));
      const params = {
        ...obj,
        ...rest,
        ...queryState,
        orgType: (state.type).toString(),
        page: queryState.page,
        isOpen: '',
      };
      return params;
    };
    const getList = () => {
      state.loading = true;
      const params = getParams();
      CommonApi.getAuditList(params).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const {
            list, numInfo,
          } = data || {};
          const { page, total } = list || {};
          const { readNotNum, recallNum } = numInfo || {};
          state.tableList = list.list || [];
          state.page = page;
          state.total = total;
          state.readNotNum = readNotNum || '0';
          state.recallNum = recallNum || '0';
          setTreeMinHeight();
        } else {
          proxy.$message.error('请求出错');
        }
      }).finally(() => {
        state.loading = false;
      });
    };

    const handleReset = () => {
      const { clearSort } = proxy.$refs.tableRef;
      clearSort();
      queryState.page = 1;
      queryState.sortColumn = '';
      queryState.sortOrder = '';
      getList();
    };

    const onSearch = () => {
      handleReset();
    };

    const {
      openModal, modalState, modalHtml, modalSlots,
    } = modalModule(getList);
    const typeChange = (isClear) => {
      const { resetForm } = proxy.$refs.queryRef;
      const { allList, type } = state;
      state.treeList = allList.filter((i) => i.type === state.type) || [];
      if (isClear === 'clear') {
        queryState.orgId = '';
        proxy.$router.push(`/auditManagement/${type ? -1 : -2}`);
        resetForm();
      }
    };
    const treeItemChange = (id, sign) => {
      const { treeList, type } = toRaw(state);
      const { resetForm } = proxy.$refs.queryRef;
      let orgId = id;
      if (sign === 'all') {
        orgId = type ? -1 : -2;
      }
      if (sign === 'query') {
        if (id < 0) {
          state.type = id === -1 ? 1 : 0;
        } else if (id && !(treeList.filter((i) => i.id === id) || []).length) {
          state.type = option.find((i) => i.val !== type).val;
        }
        typeChange();
      }
      queryState.orgId = id < 0 ? '' : id;
      proxy.$router.push(`/auditManagement/${orgId}`);
      nextTick(() => {
        const dom = document.getElementById('active');
        if (dom) {
          dom.scrollIntoView({ block: 'center' });
        }
      }).then((r) => console.log(r));
      resetForm();
    };
    const getTreeList = () => {
      const { id } = proxy.$route.params;
      CommonApi.listTopOrg().then((res) => {
        const { code, data = [] } = res.data || {};
        if (code === 200) {
          state.allList = data;
          typeChange();
          treeItemChange(Number(id) || '', 'query');
        } else {
          proxy.$message.error('请求出错');
        }
      });
    };
    const toDetail = (auctionId) => {
      window.open(`/structureCheck/${auctionId}`, '_blank');
    };

    const ColumnAction = (props) => {
      const { auctionId } = props || {};
      const { tableType } = queryState;
      const fn = Number(tableType) % 2 !== 0;
      const params = {
        ...props,
        tableType,
      };
      return <div className='action-column'>
        <el-button type="text" class='button-link top' onClick={() => toDetail(auctionId)}>结构化校验</el-button>
        {fn && <el-button type="primary" class='button-fourth middle' onClick = {() => openModal('push', params) }>推送</el-button>}
        {fn && tableType !== '3' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('noPush', params) }>不推送</el-button>}
        {tableType === '4' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('reCall', params) }>召回</el-button>}
      </div>;
    };

    const pageChange = (val) => {
      queryState.page = val;
      getList();
    };
    const sortChange = ({ prop, order }) => {
      queryState.page = 1;
      queryState.sortColumn = MONITOR_LIST[prop];
      queryState.sortOrder = MONITOR_LIST[order];
      getList();
    };
    const isNewPageClose = () => {
      window.addEventListener('storage', (e) => {
        if (e.key === 'backSign' && e.newValue === 'SUCCESS') {
          localStorage.setItem('backSign', '');
          getList();
        }
      });
    };
    watch(() => queryState.tableType, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        handleReset();
        modalState.data = {};
      }
    });
    onMounted(() => {
      getTreeList();
      isNewPageClose();
      document.title = '审核管理';
    });
    return {
      state,
      queryState,
      modalState,
      modalHtml,
      modalSlots,
      onSearch,
      ColumnAction,
      pageChange,
      treeItemChange,
      typeChange,
      sortChange,
    };
  },
  render() {
    const {
      state,
      queryState,
      treeItemChange,
      typeChange,
      ColumnAction,
      pageChange,
      modalState,
      modalSlots,
      modalHtml,
      onSearch,
      sortChange,
    } = this;
    const type = { 0: '试用', 1: '正式' };
    const list = this.state.allList.map((i) => ({ ...i, name: `${i.name}（${type[i.type]}）` }));
    const hasData = (state.treeList || []).length;
    const { readNotNum, recallNum } = state;
    return (
        <div className="yc-container audit-management-container">
            <div className="content-left">
              <div className="content-left-tree">
                <div className="content-left-tree-query">
                  <el-select v-model={queryState.orgId} filterable placeholder="请输入顶级机构名称" v-slots={selectSlots} style={{ width: '100%', marginBottom: '16px' }} popper-class='content-left-tree-query-select' >
                    {
                      list.map((i) => <el-option key={i.id} label={i.name} value={i.id} onClick={() => treeItemChange(i.id, 'query')}></el-option>)
                    }
                  </el-select>
                </div>
                <div className="content-left-tree-tabs">
                    <div className="content-left-tree-tabs-content">
                      <el-radio-group v-model={state.type} onChange={() => typeChange('clear')}>
                        {
                          option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                        }
                      </el-radio-group>
                    </div>
                </div>
                <div className="content-left-tree-list" style={{ height: state.height }} id='treeList' v-show={hasData}>
                    <div className="content-left-tree-list-title" onClick={() => treeItemChange('', 'all')}>
                      <svg className="icon" aria-hidden="true" style={{ width: '18px', height: '18px', marginRight: '8px' }}>
                        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
                      </svg>
                      <span className={!queryState.orgId ? 'active' : ''}>全部{type[state.type]}机构</span>
                    </div>
                    <div className='content-left-tree-list-content'>
                      <el-timeline>
                        {
                          state.treeList.map((i) => (
                            <el-timeline-item
                              key={i.id}
                              v-slots={timeLineSlots}
                              onClick={() => treeItemChange(i.id)}
                              className={`${queryState.orgId === i.id ? 'active' : ''} el-timeline-item` }
                              id={`${queryState.orgId === i.id ? 'active' : ''}` }
                            >
                              {i.name}
                            </el-timeline-item>))
                        }
                      </el-timeline>
                    </div>
                </div>
                <div className="content-left-tree-no-data" v-show={!hasData}>
                  <img src={NoOrgImg} alt="" />
                  <p>暂无数据</p>
                </div>
              </div>
            </div>
            <div className="content-right" id='content-right' ref='RightRef'>
              <Query ref="queryRef" onHandleSearch={onSearch} onHandleClearQuery = {onSearch}/>
              <div className="content-right-table">
                  <div className="content-right-table-tabs">
                    <el-tabs v-model={queryState.tableType}>
                      {
                        auditTabs(readNotNum, recallNum).map((i) => (
                          <el-tab-pane
                            label={i.label}
                            name={i.name}
                            key={i.name}
                          />
                        ))
                      }
                    </el-tabs>
                  </div>
                <div className="content-right-table-list">
                  <el-table
                    data={state.tableList}
                    v-loading={state.loading}
                    v-slots={tableEmptytSlots}
                    row-key={(val) => val.id}
                    onSortChange={sortChange}
                    ref="tableRef"
                  >
                    {
                      auditColumn.map((i) => (
                        <el-table-column
                          label={i.label}
                          key={i.prop}
                          prop={i.prop}
                          min-width={i.width}
                          className ={i.prop}
                          sortable={i.sort}
                          v-slots={(scope) => <div className='column-item-content'>{columnHtml(scope.row, queryState.tableType)[i.prop]}</div>}
                        />
                      ))
                    }
                    <el-table-column label="操作" min-width='10%' v-slots={(scope) => <ColumnAction {...scope.row}/>}/>
                  </el-table>
                  <el-pagination
                    onCurrentChange={pageChange}
                    background
                    current-page={state.page}
                    layout='total, prev, pager, next, jumper'
                    total={state.total}
                    key={state.page}
                />
                </div>
              </div>
            </div>
          <div className="content-modal yc-custom-modal">
            <el-dialog
              v-model={modalState.visible}
              width={modalState.type === 'reCall' ? '556px' : '500px'}
              destroy-on-close
              show-close={false}
              v-slots={modalSlots}
            >
              {modalHtml[modalState.type]}
            </el-dialog>
          </div>
        </div>
    );
  },
});
